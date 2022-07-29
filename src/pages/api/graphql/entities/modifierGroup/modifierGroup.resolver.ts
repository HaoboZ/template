import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import ModifierGroup from './modifierGroup.entity';
import ModifierGroupValidator, { ModifierGroupPartialValidator } from './modifierGroup.validator';

@Resolver( ModifierGroup )
export default class ModifierGroupResolver extends BaseResolver {
	
	type = 'MODIFIER_GROUP';
	Obj = ModifierGroup;
	searchFields = [ 'name' ];
	_company = true;
	
	@Query( () => [ ModifierGroup ] )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_SELECT' )
	async modifierGroups(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_SELECT' )
	async modifierGroupsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => ModifierGroup, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_SELECT' )
	async modifierGroup(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => ModifierGroup )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_CREATE' )
	async createModifierGroup(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: ModifierGroupValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_CREATE' )
	async createModifierGroups(
		@Arg( 'input', () => [ ModifierGroupValidator ] ) input: ModifierGroupValidator[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id' ], input );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => ModifierGroup )
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_UPDATE' )
	async updateModifierGroup(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: ModifierGroupPartialValidator,
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
	@Authorized( 'OWNER', 'ADMIN', 'MODIFIER_GROUP_UPDATE' )
	async deleteModifierGroups(
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
