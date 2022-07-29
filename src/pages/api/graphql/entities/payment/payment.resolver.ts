import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { verifyCount } from '../company/company.resolver';
import Order from '../order/order.entity';
import { setOrderVariables } from '../order/order.resolver';
import Payment from './payment.entity';
import PaymentValidator, { PaymentPartialValidator } from './payment.validator';

@Resolver( Payment )
export default class PaymentResolver extends BaseResolver {
	
	type = 'PAYMENT';
	Obj = Payment;
	searchFields = [ 'type', 'checkNumber', 'note', 'status' ];
	_company = true;
	
	@Query( () => [ Payment ] )
	async payments(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async paymentsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Payment, { nullable: true } )
	async payment(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId } );
	}
	
	@Mutation( () => Payment )
	async createPayment(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: PaymentValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id, externalId }, input );
		if ( entity.type !== 'CASH' && entity.type !== 'CHECK' ) {
			await verifyCount( ctx, entity, 'payment' );
		}
		let order;
		if ( entity.order?.id ) {
			order = await ctx.em.getRepository( Order ).findOne( { id: entity.order.id } );
			await setOrderVariables( ctx, order );
		}
		await ctx.em.flush();
		
		if ( order ) {
			await this.createLogEntry( ctx, {
				id     : this.stringOrId( order ),
				company: { id: ctx.req.headers.company }
			}, 'Payment' );
			await this.notification( ctx, pubSub, this.stringOrId( order ), 'ORDER' );
		}
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	async createPayments(
		@Arg( 'input', () => [ PaymentValidator ] ) input: PaymentValidator[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input );
		await verifyCount( ctx, entities.filter( ( { type } ) => type !== 'CASH' && type !== 'CHECK' ), 'payment' );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Payment )
	async updatePayment(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: PaymentPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input );
		let order;
		if ( entity.order?.id ) {
			order = await ctx.em.getRepository( Order ).findOne( { id: entity.order.id } );
			await setOrderVariables( ctx, order );
		}
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		if ( order ) {
			await this.createLogEntry( ctx, {
				id     : this.stringOrId( order ),
				company: { id: ctx.req.headers.company }
			}, 'Update Payment' );
			await this.notification( ctx, pubSub, order.id, order.type );
		}
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN' )
	async deletePayments(
		@Arg( 'ids', () => [ String ], { nullable: true } ) ids: string[],
		@Arg( 'externalIds', () => [ String ], { nullable: true } ) externalIds: string[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids || externalIds, ids ? 'id' : 'externalId' );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
}
