import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import { CommerceType } from '../../enums/commerceType.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import SubscriptionInvoice from '../order/order.entity';
import { setOrderVariables } from '../order/order.resolver';
import SubscriptionInvoiceValidator, {
	OrderPartialValidator as SubscriptionInvoicePartialValidator
} from '../order/order.validator';

@Resolver( SubscriptionInvoice )
export default class SubscriptionInvoiceResolver extends BaseResolver {
	
	type = 'SUBSCRIPTION_INVOICE';
	Obj = SubscriptionInvoice;
	_company = true;
	
	@Query( () => [ SubscriptionInvoice ] )
	@Authorized( 'OWNER' )
	async subscriptionInvoices(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		set( options, 'filter.type', CommerceType.SUBSCRIPTION );
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER' )
	async subscriptionInvoicesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.SUBSCRIPTION );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => SubscriptionInvoice, { nullable: true } )
	@Authorized( 'OWNER' )
	async subscriptionInvoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { type: CommerceType.SUBSCRIPTION, id, externalId } );
	}
	
	@Mutation( () => SubscriptionInvoice )
	@Authorized( 'SU' )
	async createSubscriptionInvoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: SubscriptionInvoiceValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id, externalId }, input, { type: CommerceType.SUBSCRIPTION } );
		entity.assign( { type: CommerceType.SUBSCRIPTION } );
		await setOrderVariables( ctx, entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => SubscriptionInvoice )
	@Authorized( 'SU' )
	async updateSubscriptionInvoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: SubscriptionInvoicePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { type: CommerceType.SUBSCRIPTION, id, externalId }, input );
		await setOrderVariables( ctx, entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
}
