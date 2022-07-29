import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Resolver } from 'type-graphql';
import { Context } from '../../context';
import BaseResolver from '../base.resolver';
import InventoryEntry from './inventoryEntry.entity';
import InventoryEntryValidator, { InventoryEntryPartialValidator } from './inventoryEntry.validator';

@Resolver( InventoryEntry )
export default class InventoryEntryResolver extends BaseResolver {
	
	type = 'INVENTORY_RUN';
	Obj = InventoryEntry;
	searchFields = [ 'name', 'price', 'quantity', 'sku', 'vendorSku' ];
	
	@Mutation( () => InventoryEntry )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_CREATE' )
	async createInventoryEntry(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: InventoryEntryValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.inventoryRun.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => InventoryEntry )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_UPDATE' )
	async updateInventoryEntry(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: InventoryEntryPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.inventoryRun.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'INVENTORIES_UPDATE' )
	async deleteInventoryEntries(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		await ctx.em.removeAndFlush( entities );
		await this.notifications( ctx, pubSub, map( entities, 'inventoryRun.id' ) );
		return true;
	}
	
}
