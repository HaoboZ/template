import { format } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import {
	get,
	isArray,
	isEmpty,
	isNil,
	isObject,
	isObjectLike,
	map,
	omitBy,
	pick,
	reduce,
	set,
	transform
} from 'lodash-es';
import { SOFT_DELETABLE_FILTER } from 'mikro-orm-soft-delete';
import fieldsToRelations from '../../fieldsToRelations';
import ConditionalOptions from '../conditionalOptions';
import { Context } from '../context';
import Log from './log/log.entity';

export default abstract class BaseResolver {
	
	abstract type: string;
	abstract Obj: any;
	searchFields?: string[];
	_company = false;
	
	private static includeSearch( obj ) {
		if ( !obj ) return obj;
		return transform( obj, ( result, val, key ) => {
			result[ key ] = isObject( val )
				? BaseResolver.includeSearch( val )
				: key === '$ilike' ? `%${val}%` : val;
		} );
	}
	
	private static removeEmpty( obj ) {
		for ( const [ key, value ] of Object.entries( obj ) ) {
			if ( isObjectLike( value ) && !isArray( value ) ) {
				// @ts-ignore
				if ( value.id && !value.createdAt ) delete obj[ key ];
			}
		}
	}
	
	async findAll(
		{ req, em }: Context,
		info: GraphQLResolveInfo,
		search: string,
		options: ConditionalOptions,
		ignoreCompany?: boolean
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery = options.filter || {};
		if ( !ignoreCompany && this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		if ( search && this.searchFields ) {
			filterQuery.$or = this.searchFields.map( ( field ) => {
				const obj = {};
				if ( /^\d+(\.\d{1,2})?$/.test( search ) ) {
					if ( field === 'grandTotal' ) {
						set( obj, field, { $eq: search } );
						return obj;
					}
				}
				if ( field !== 'grandTotal' ) {
					set( obj, field, { $ilike: search } );
					return obj;
				}
			} );
		}
		const objs = await repo.find( BaseResolver.includeSearch( filterQuery ), {
			limit  : Math.min( options.limit || 10, 1000 ),
			offset : options.offset,
			orderBy: options.orderBy?.map( ( orderBy ) => {
				const [ key, value ] = orderBy.split( ':' );
				return set( {}, key, value );
			} ),
			...fieldsToRelations( info )
		} );
		objs.forEach( ( obj ) => BaseResolver.removeEmpty( obj ) );
		return objs;
	}
	
	async findAllExport(
		{ req, em }: Context,
		search: string,
		options: ConditionalOptions,
		populate?: string[],
		ignoreCompany?: boolean
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery = options.filter || {};
		if ( !ignoreCompany && this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		if ( search && this.searchFields ) {
			filterQuery.$or = this.searchFields.map( ( field ) => {
				const obj = {};
				if ( /^\d+(\.\d{1,2})?$/.test( search ) ) {
					if ( field === 'grandTotal' ) {
						set( obj, field, { $eq: search } );
						return obj;
					}
				}
				if ( field !== 'grandTotal' ) {
					set( obj, field, { $ilike: search } );
					return obj;
				}
			} );
		}
		
		return await repo.find( BaseResolver.includeSearch( filterQuery ), {
			populate,
			limit  : 1000,
			offset : options.offset,
			orderBy: options.orderBy?.map( ( orderBy ) => {
				const [ key, value ] = orderBy.split( ':' );
				return set( {}, key, value );
			} )
		} );
	}
	
	async findIds(
		{ req, em }: Context,
		ids: string[],
		key = 'id',
		query?: any
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery: any = { ...query, [ key ]: { $in: ids } };
		if ( this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		return await repo.find( filterQuery );
	}
	
	async count(
		{ req, em }: Context,
		search?: string,
		filter?: any,
		ignoreCompany?: boolean
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery = filter || {};
		if ( !ignoreCompany && this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		if ( search && this.searchFields ) {
			filterQuery.$or = this.searchFields.map( ( field ) => {
				const obj = {};
				if ( /^\d+(\.\d{1,2})?$/.test( search ) ) {
					if ( field === 'grandTotal' ) {
						set( obj, field, { $eq: search } );
					}
				} else {
					if ( field !== 'grandTotal' ) {
						set( obj, field, { $ilike: search } );
					}
				}
				return obj;
			} );
		}
		return await repo.count( BaseResolver.includeSearch( filterQuery ) );
	}
	
	async find(
		{ req, em }: Context,
		info?: GraphQLResolveInfo,
		query?: any,
		ignoreCompany?: boolean
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery: any = omitBy( query, isNil );
		if ( isEmpty( filterQuery ) ) return null;
		if ( !ignoreCompany && this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		const obj = await repo.findOneOrFail( filterQuery, info ? fieldsToRelations( info ) : undefined );
		BaseResolver.removeEmpty( obj );
		return obj;
	}
	
	condense( obj: any ) {
		if ( !isObjectLike( obj ) ) return obj;
		if ( isArray( obj ) ) {
			return obj.map( ( o ) => this.condense( o ) );
		} else {
			return reduce( obj, ( acc, value, key ) => {
				if ( value === undefined ) return acc;
				return { ...acc, [ key ]: this.check( value ) };
			}, {} );
		}
	}
	
	async create(
		{ req, em }: Context,
		query: any,
		input: any,
		extraQuery?: any,
		preSave?: ( entity: any ) => any
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery: any = omitBy( query, isNil );
		if ( isEmpty( filterQuery ) ) filterQuery.id = null;
		let entity: any;
		if ( isEmpty( filterQuery ) ) {
			entity = null;
		} else {
			entity = await repo.findOne( { ...filterQuery, ...extraQuery }, {
				populate: this.getObjKeys( input ),
				filters : { [ SOFT_DELETABLE_FILTER ]: false }
			} );
			if ( entity && this._company && req.headers.company && !req.headers._skip && entity.company.id !== req.headers.company ) return null;
		}
		if ( !entity ) entity = new this.Obj( true );
		if ( this._company && req.headers.company )
			input.company = req.headers.company;
		const { metadata, ...inputQuery } = this.condense( input );
		await preSave?.( entity );
		if ( isObject( metadata ) ) {
			entity.metadata = { ...entity.metadata, ...metadata };
		}
		entity.assign( inputQuery, { em, mergeObjects: false } );
		entity.deletedAt = null;
		em.persist( entity );
		return entity;
	}
	
	async createMulti(
		ctx: Context,
		queryFields: string[],
		input: any[],
		extraQuery?: any
	) {
		return ( await Promise.all( input.map( ( entity ) =>
			this.create( ctx, pick( entity, queryFields ), entity, extraQuery ) ) ) )
			.filter( Boolean );
	}
	
	async update(
		{ req, em }: Context,
		query: any,
		input: any,
		preSave?: ( entity: any ) => any,
		ignoreCompany?: boolean
	) {
		const repo = em.getRepository<any>( this.Obj );
		const filterQuery: any = omitBy( query, isNil );
		if ( isEmpty( filterQuery ) ) filterQuery.id = null;
		if ( !ignoreCompany && this._company && !req.headers._skip ) {
			if ( !req.headers.company ) throw 'Missing Company';
			filterQuery.company = req.headers.company;
		}
		const entity = await repo.findOneOrFail( filterQuery, {
			populate: this.getObjKeys( input )
		} );
		if ( this._company && req.headers.company ) input.company = req.headers.company;
		const { metadata, ...inputQuery } = this.condense( input );
		await preSave?.( entity );
		if ( isObject( metadata ) ) {
			entity.metadata = { ...entity.metadata, ...metadata };
		}
		entity.assign( inputQuery, { em, mergeObjects: false } );
		em.persist( entity );
		return entity;
	}
	
	async notification( { req }: Context, pubSub: PubSubEngine, id: string, typeOverride?: string ) {
		const payload = { id, message: '' };
		if ( process.env.NODE_ENV === 'development' )
			console.log( `trigger: ${typeOverride || this.type}_${id}` );
		await pubSub.publish( `${typeOverride || this.type}_${id}`, payload );
		if ( this._company ) {
			if ( process.env.NODE_ENV === 'development' )
				console.log( `trigger: ${typeOverride || this.type}_COMPANY` );
			await pubSub.publish( `${typeOverride || this.type}_${req.headers.company}`, payload );
		}
	}
	
	async notifications( ctx: Context, pubSub: PubSubEngine, ids: string[], typeOverrides?: string[] ) {
		await Promise.all( ids.map( ( id, index ) =>
			this.notification( ctx, pubSub, id, typeOverrides?.[ index ] ) ) );
	}
	
	async createLogEntry( { req, em, user }: Context, entity, action: string, logging?: string ) {
		const entities = !Array.isArray( entity ) ? [ entity ] : entity;
		if ( !entities.length ) return;
		em.persist( entities.map( ( entity ) => {
			let _action = action;
			if ( _action === 'Create' && !entity._new ) _action = 'Update';
			
			return new Log().assign( {
				table     : this.type,
				documentId: entity.id,
				name      : `${_action} ${logging || ''}`,
				user,
				company   : entity.company?.id || req.headers.company as string,
				ip        : req.ip.substring( 0, 7 ) === '::ffff:' ? req.ip.substring( 7 ) : req.ip
			}, { em } );
		} ) );
	}
	
	async generateCSVString( columns: { key: string | string[], name: string }[], data: any[] ) {
		const csvHeaders = map( columns, 'name' );
		const csvData = data.map( ( purchase ) => columns.map( ( header ) => {
			let value;
			
			if ( header.key === 'total' ) {
				value = get( purchase, 'quantity' ) * get( purchase, 'price' );
				return value % 1 === 0 ? value : value.toFixed( 2 );
			}
			
			if ( Array.isArray( header.key ) ) {
				value = header.key.reduce( ( value, keyItem ) => {
					value = get( purchase, keyItem );
					if ( value ) {
						return value;
					}
					
				}, '' );
			} else {
				value = get( purchase, header.key );
			}
			
			if ( typeof value === 'string' ) {
				return value.replaceAll( ',', '' );
			} else if ( typeof value === 'number' ) {
				return value % 1 === 0 ? value : value.toFixed( 2 );
			} else if ( value instanceof Date ) {
				return format( value, 'PP' ).replace( ',', '' );
			} else {
				return value;
			}
			
		} ) );
		return [ csvHeaders, ...csvData ].reduce( ( csv, rowArray ) => {
			const row = rowArray.join( ',' );
			return csv + row + '\n';
		}, '' );
	}
	
	stringOrId( entity ) {
		return typeof entity === 'string' ? entity : entity.id;
	}
	
	private getObjKeys( input, parent = '' ) {
		if ( !input ) return [];
		return reduce( input, ( keys, value, key ) => {
			const newKey = parent ? `${parent}.${key}` : key;
			if ( this.Obj?.jsons?.includes( key ) ) return keys;
			if ( isArray( value ) ) {
				keys.push( newKey, ...this.getObjKeys( value[ 0 ], newKey ) );
			} else if ( isObject( value ) ) {
				keys.push( newKey, ...this.getObjKeys( value, newKey ) );
			}
			return keys;
		}, [] );
	}
	
	private check( value ) {
		switch ( typeof value ) {
		case 'object': {
			if ( !value ) return null;
			if ( value instanceof Date ) return value;
			const condensed = this.condense( value );
			const keys = Object.keys( condensed );
			return keys.length === 1 && keys[ 0 ] === 'id' ? value.id : condensed;
		}
		default:
			return value;
		}
	}
	
}
