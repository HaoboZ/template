import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { verifyCount } from '../company/company.resolver';
import InventoryRun from './inventoryRun.entity';
import InventoryRunValidator, { InventoryRunPartialValidator } from './inventoryRun.validator';

@Resolver( InventoryRun )
export default class InventoryRunResolver extends BaseResolver {
	
	type = 'INVENTORY_RUN';
	Obj = InventoryRun;
	searchFields = [ 'number' ];
	_company = true;
	
	@Query( () => [ InventoryRun ] )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_SELECT' )
	async inventoryRuns(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_SELECT' )
	async inventoryRunsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => InventoryRun, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_SELECT' )
	async inventoryRun(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => InventoryRun )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_CREATE' )
	async createInventoryRun(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: InventoryRunValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await verifyCount( ctx, entity, 'inventory' );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => InventoryRun )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_UPDATE' )
	async updateInventoryRun(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: InventoryRunPartialValidator,
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
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_UPDATE' )
	async deleteInventoryRuns(
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
	
}
