import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, partition, round, set, sum } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import { CommerceType } from '../../enums/commerceType.enum';
import { OrderStatus } from '../../enums/orderStatus.enum';
import { PaymentStatus } from '../../enums/paymentStatus.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { mergeCommerce } from '../commerce/commerce.resolver';
import { verifyCount } from '../company/company.resolver';
import Order from './order.entity';
import OrderValidator, { OrderPartialValidator } from './order.validator';

@Resolver( Order )
export default class OrderResolver extends BaseResolver {
	
	type = 'ORDER';
	Obj = Order;
	searchFields = [ 'number', 'client.name', 'client.contact', 'grandTotal', 'lineItems.name' ];
	_company = true;
	
	@Query( () => [ Order ] )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_SELECT' )
	async orders(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.ORDER );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_SELECT' )
	async ordersCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.ORDER );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Order, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_SELECT' )
	async order(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { type: CommerceType.ORDER, id, externalId } );
	}
	
	@Query( () => Order, { nullable: true } )
	async orderPublic(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { type: CommerceType.ORDER, id, externalId }, true );
	}
	
	@Mutation( () => Order )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_CREATE' )
	async createOrder(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: OrderValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		input.payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} );
		const entity = await this.create( ctx, { id, externalId }, input, { type: CommerceType.ORDER } );
		await verifyCount( ctx, entity, 'order' );
		entity.assign( { type: CommerceType.ORDER } );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_CREATE' )
	async createOrders(
		@Arg( 'input', () => [ OrderValidator ] ) input: OrderValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		input.forEach( ( { payments } ) => payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} ) );
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input, { type: CommerceType.ORDER } );
		await verifyCount( ctx, entities, 'order' );
		await Promise.all( entities.map( async ( entity ) => {
			entity.assign( { type: CommerceType.ORDER } );
			await setOrderVariables( ctx, entity );
		} ) );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Order )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_UPDATE' )
	async updateOrder(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: OrderPartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { type: CommerceType.ORDER, id, externalId }, input );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_UPDATE' )
	async deleteOrders(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.ORDER } );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Order )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_CREATE' )
	async mergeOrders(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.ORDER } );
		const entity = await mergeCommerce( ctx, entities );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'ORDERS_SELECT' )
	async exportOrders(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		set( options, 'filter.type', CommerceType.ORDER );
		
		const orders = await this.findAllExport( ctx, search, options, [ 'client' ] );
		
		return await this.generateCSVString( [
			{ key: 'id', name: 'ID' },
			{ key: 'number', name: 'Number' },
			{ key: 'client.id', name: 'Client ID' },
			{ key: 'client.name', name: 'Client Name' },
			{ key: 'client.contact', name: 'Client Contact' },
			{ key: 'client.email', name: 'Client Email' },
			{ key: 'client.phone', name: 'Client Phone' },
			{ key: 'client.companyNumber', name: 'Client Company Number' },
			{ key: 'status', name: 'Status' },
			{ key: 'type', name: 'Type' },
			{ key: 'serviceDate', name: 'Service Date' },
			{ key: 'paidDate', name: 'Paid Date' },
			{ key: 'dueDate', name: 'Due Date' },
			{ key: 'deliveryStatus', name: 'Delivery' },
			{ key: 'subTotal', name: 'SubTotal' },
			{ key: 'taxTotal', name: 'Tax Total' },
			{ key: 'taxPercent', name: 'Tax Percent' },
			{ key: 'grandTotal', name: 'Grand Total' }
		], orders );
	}
	
}

export async function setOrderVariables( { req, em }: Context, order: Order ) {
	const repo = em.getRepository( Order );
	await em.populate( order, [ 'client', 'prices', 'lineItems', 'lineItems.prices', 'payments' ] );
	
	if ( req.headers.company && !order.number || order.number.includes( 'Draft' ) ) {
		if ( order.client && order.sent ) {
			const count = await repo.count( {
				company  : req.headers.company,
				type     : order.type,
				client   : order.client.id,
				createdAt: { $lt: order.createdAt }
			} ) + 1;
			order.number = `${order.client.code}-${count.toString().padStart( 4, '0' )}`;
		} else {
			order.number = `${order.client?.code || '000000'}-Draft`;
		}
	}
	
	const lineItems = order.lineItems.getItems();
	
	const totals = lineItems.map( ( lineItem ) => {
		let total = lineItem.price;
		const [ discounts, fees ] = partition( lineItem.prices.getItems(), ( { value } ) => value < 0 );
		total += fees.reduce( ( sum, price ) => sum + ( price.isPercent
			? price.value * total / 100
			: price.value * price.quantity ), 0 );
		total += discounts.reduce( ( sum, price ) => sum + ( price.isPercent
			? price.value * total / 100
			: price.value * price.quantity ), 0 );
		return total * lineItem.quantity;
	} );
	
	order.subTotal = round( sum( totals ), 2 );
	let additionalPrices = 0;
	
	const [ discounts, fees ] = partition( order.prices.getItems(), ( { value } ) => value < 0 );
	order.taxTotal = round( totals.reduce( ( sum, total, index ) => {
		const discountTotal = discounts.reduce( ( sum, price ) => sum + ( price.isPercent
			? price.value * total / 100
			: price.value * price.quantity / totals.length ), 0 );
		const subTotal = total + discountTotal;
		const feeTotal = fees.reduce( ( sum, price ) => sum + ( price.isPercent
			? price.value * subTotal / 100
			: price.value * price.quantity / totals.length ), 0 );
		additionalPrices += discountTotal + feeTotal;
		return sum + subTotal * ( ( lineItems[ index ].tax === null
			? order.taxPercent
			: lineItems[ index ].tax ) || 0 ) / 100;
	}, 0 ), 2 );
	
	if ( order.overrideTotal ) {
		order.grandTotal = round( order.overrideTotal, 2 );
	} else {
		order.grandTotal = round( order.subTotal + additionalPrices + order.taxTotal, 2 );
	}
	
	const payments = order.payments.getItems();
	
	let refunded = false;
	let pending = false;
	
	order.paidTotal = round( payments.reduce( ( sum, { status, amount } ) => {
		if ( [ PaymentStatus.PAID, PaymentStatus.SUCCEEDED ].includes( status ) ) {
			return sum + amount;
		}
		if ( [ PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED ].includes( status ) ) {
			refunded = true;
			return sum + amount;
		}
		if ( status === PaymentStatus.OPEN ) pending = true;
		return sum;
	}, 0 ), 2 );
	
	if ( order.grandTotal > 0 && order.paidTotal >= order.grandTotal ) {
		order.paid = true;
	}
	
	if ( order.cancelled ) {
		order.status = OrderStatus.CANCELLED;
	} else if ( refunded ) {
		order.status = OrderStatus.REFUNDED;
	} else if ( order.paidTotal > 0 && order.paidTotal < order.grandTotal ) {
		order.status = OrderStatus.PARTIALLY_PAID;
	} else if ( order.paid ) {
		order.status = OrderStatus.PAID;
	} else if ( pending ) {
		order.status = OrderStatus.PENDING;
	} else if ( order.standingActive ) {
		order.status = OrderStatus.STANDING;
	} else if ( order.invoiced ) {
		order.status = OrderStatus.INVOICED;
	} else if ( order.completed ) {
		order.status = OrderStatus.COMPLETED;
	} else if ( order.viewed ) {
		order.status = OrderStatus.VIEWED;
	} else if ( order.sent ) {
		order.status = OrderStatus.SENT;
	} else {
		order.status = OrderStatus.DRAFT;
	}
	em.persist( order );
}
