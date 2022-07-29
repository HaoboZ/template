import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, omit, pick, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import LineItem from '../lineItem/lineItem.entity';
import Price from '../price/price.entity';
import Store from './store.entity';
import StoreValidator, { StorePartialValidator } from './store.validator';

@Resolver( Store )
export default class StoreResolver extends BaseResolver {
	
	type = 'STORE';
	Obj = Store;
	searchFields = [ 'name', 'description' ];
	_company = true;
	
	@Query( () => [ Store ] )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_SELECT' )
	async stores(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_SELECT' )
	async storesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Store, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_SELECT' )
	async store(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Query( () => Store, { nullable: true } )
	async storePublic(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id }, true );
	}
	
	@Mutation( () => Store )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_CREATE' )
	async createStore(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: StoreValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Store )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_UPDATE' )
	async updateStore(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: StorePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_UPDATE' )
	async deleteStores(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Store )
	@Authorized( 'OWNER', 'ADMIN', 'STORE_CREATE' )
	async copyStore(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		const entity = await mergeStore( ctx, entities );
		ctx.em.persist( entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
}

async function mergeStore( { em }: Context, stores: Store[] ) {
	await Promise.all( stores.map( ( store ) =>
		em.populate( store, [ 'lineItems',
			'prices',
			'locations',
			'lineItems.modifierGroups',
			'lineItems.modifierGroups.modifiers' ] ) ) );
	const newStore = new Store().assign( pick( stores[ 0 ], [
		'name', 'banner', 'description', 'active', 'minDelivery', 'taxPercent', 'type', 'city', 'country', 'zipCode',
		'hours', 'rewards', 'metadata', 'company'
	] ), { em } );
	stores.forEach( ( store ) => {
		store.lineItems.getItems().forEach( ( lineItem ) => {
			const newLineItem = new LineItem().assign( {
				...omit( lineItem, [ 'id' ] ),
				modifierGroups: lineItem.modifierGroups.getItems().map( ( { id } ) => id )
			}, { em } );
			newStore.lineItems.add( newLineItem );
		} );
		store.prices.getItems().forEach( ( price ) =>
			newStore.prices.add( new Price().assign( omit( price, [ 'id' ] ), { em } ) ) );
		newStore.assign( { locations: store.locations.getItems() }, { em } );
	} );
	
	return newStore;
}
