import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { verifyCount } from '../company/company.resolver';
import Item from './item.entity';
import ItemValidator, { ItemPartialValidator } from './item.validator';

@Resolver( Item )
export default class ItemResolver extends BaseResolver {
	
	type = 'ITEM';
	Obj = Item;
	searchFields = [ 'name', 'description', 'categories.name', 'locations.address.line1' ];
	_company = true;
	
	@Query( () => [ Item ] )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_SELECT' )
	async items(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'locations', () => [ String ], { nullable: true } ) locations: string[],
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		if ( locations?.length ) set( options, 'filter.locations.$in', locations );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_SELECT' )
	async itemsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'locations', () => [ String ], { nullable: true } ) locations: string[],
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( locations?.length ) set( filter, 'locations.$in', locations );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Item, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_SELECT' )
	async item(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId } );
	}
	
	@Mutation( () => Item )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_CREATE' )
	async createItem(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: ItemValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id, externalId }, input );
		await verifyCount( ctx, entity, 'item' );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_CREATE' )
	async createItems(
		@Arg( 'input', () => [ ItemValidator ] ) input: ItemValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input );
		await verifyCount( ctx, entities, 'item' );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Item )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_UPDATE' )
	async updateItem(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: ItemPartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_UPDATE' )
	async deleteItems(
		@Arg( 'ids', () => [ String ], { nullable: true } ) ids: string[],
		@Arg( 'externalIds', () => [ String ], { nullable: true } ) externalIds: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids || externalIds, ids ? 'id' : 'externalId' );
		ctx.em.remove( entities );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'ITEMS_SELECT' )
	async exportItems(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		const items = await this.findAllExport( ctx, search, options, [ 'uoms', 'categories' ] );
		
		return await this.generateCSVString( [
			{ key: 'id', name: 'ID' },
			{ key: 'name', name: 'Name' },
			{ key: 'description', name: 'Description' },
			{ key: 'categories[0].name', name: 'Category' },
			{ key: 'uoms[0].name', name: 'Unit' },
			{ key: 'uoms[0].price', name: 'Price' },
			{ key: 'uoms[0].cost', name: 'Cost' },
			{ key: 'uoms[0].sku', name: 'SKU' },
			{ key: 'uoms[0].quantity', name: 'Stock' },
			{ key: 'taxable', name: 'Taxable' },
			{ key: 'type', name: 'Type' },
			{ key: 'uoms[0].id', name: 'Unit Id' }
		], items );
	}
	
}
