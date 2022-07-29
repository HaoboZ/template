import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Gateway from './gateway.entity';
import GatewayValidator, { GatewayPartialValidator } from './gateway.validator';

@Resolver( Gateway )
export default class GatewayResolver extends BaseResolver {
	
	type = 'GATEWAY';
	Obj = Gateway;
	searchFields = [ 'external', 'active', 'externalId', 'externalKey' ];
	_company = true;
	
	@Query( () => [ Gateway ] )
	async gateways(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		set( options, 'filter.active', true );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async gatewaysCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'active', true );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Gateway, { nullable: true } )
	async gateway(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId }, true );
	}
	
	@Mutation( () => Gateway )
	@Authorized( 'OWNER', 'ADMIN' )
	async createGateway(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: GatewayValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id, externalId }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Gateway )
	@Authorized( 'OWNER', 'ADMIN' )
	async updateGateway(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: GatewayPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input, undefined, true );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN' )
	async deleteGateway(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, [ id ] );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
}
