import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import { SubscriptionStatus } from '../../enums/subscriptionStatus.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Company from '../company/company.entity';
import Subscribe from './subscribe.entity';
import SubscribeValidator, { SubscribePartialValidator } from './subscribe.validator';

@Resolver( Subscribe )
export default class SubscribeResolver extends BaseResolver {
	
	type = 'SUBSCRIBE';
	Obj = Subscribe;
	_company = true;
	
	@Query( () => [ Subscribe ] )
	@Authorized( 'SU' )
	async subscriptions(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'SU' )
	async subscriptionsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Subscribe, { nullable: true } )
	@Authorized( 'SU' )
	async subscription(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId } );
	}
	
	@Mutation( () => Subscribe )
	@Authorized( 'OWNER' )
	async createSubscription(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: SubscribeValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const company = await ctx.em.getRepository( Company ).findOne( { id: ctx.req.headers.company } );
		const entity = await this.create( ctx, { id, externalId }, input );
		company.assign( { subscription: entity.id } );
		ctx.em.persist( company );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Subscribe )
	@Authorized( 'SU' )
	async updateSubscription(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: SubscribePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER' )
	async deleteSubscription(
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.find( ctx );
		entity.status = SubscriptionStatus.CANCELED;
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return true;
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'SU' )
	async deleteSubscriptions(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entities = await this.findIds( ctx, [ id ] );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
}
