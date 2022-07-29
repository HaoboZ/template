import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Uom from './uom.entity';
import { UomPartialValidator } from './uom.validator';

@Resolver( Uom )
export default class UomResolver extends BaseResolver {
	
	type = 'UOM';
	Obj = Uom;
	searchFields = [ 'name', 'sku', 'item.name', 'item.categories.name' ];
	
	@Query( () => Uom )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_SELECT' )
	async uom(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'sku', { nullable: true } ) sku: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !sku ) return null;
		return await this.find( ctx, info, { id, sku } );
	}
	
	@Query( () => [ Uom ] )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_SELECT' )
	async uoms(
		@Arg( 'locationId', { nullable: true } ) locationId: string,
		@Arg( 'menuId', { nullable: true } ) menuId: string,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		if ( locationId ) set( options, 'filter.item.locations', locationId );
		if ( menuId ) set( options, 'filter.menus', menuId );
		
		set( options, 'filter.item.deletedAt', null );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'MENUS_SELECT' )
	async uomsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'menuId', { nullable: true } ) menuId: string,
		@Arg( 'locations', () => [ String ], { nullable: true } ) locations: string[],
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( menuId ) set( filter, 'menus', menuId );
		return await this.count( ctx, search, filter );
	}
	
	@Mutation( () => Uom )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_UPDATE' )
	async updateUom(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: UomPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'MENUS_SELECT' )
	async exportUoms(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		if ( !ctx.req.headers.company ) throw 'Company is required';
		
		if ( options.filter.item ) {
			set( options.filter.item, 'company', ctx.req.headers.company );
		} else {
			set( options.filter, 'item', { company: ctx.req.headers.company } );
		}
		const uoms = await this.findAllExport( ctx, search, options, [ 'item' ] );
		
		return await this.generateCSVString( [
			{ key: 'item.id', name: 'ID' },
			{ key: 'item.name', name: 'Name' },
			{ key: 'item.description', name: 'Description' },
			{ key: 'item.categories[0].name', name: 'Category' },
			{ key: 'name', name: 'Unit' },
			{ key: 'sku', name: 'SKU' },
			{ key: 'price', name: 'Price' }
		], uoms );
	}
}
