import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { setOrderVariables } from '../order/order.resolver';
import LineItem from './lineItem.entity';
import LineItemValidator, { LineItemPartialValidator } from './lineItem.validator';

@Resolver( LineItem )
export default class LineItemResolver extends BaseResolver {
	
	type = 'LINE_ITEM';
	Obj = LineItem;
	searchFields = [ 'name', 'description', 'unit', 'note' ];
	
	@Query( () => [ LineItem ] )
	async lineItems(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.filter.order ) {
			set( options.filter, 'order', { company: ctx.req.headers.company } );
		}
		if ( typeof options.filter.order === 'object' ) {
			set( options.filter.order, 'company', ctx.req.headers.company );
		}
		
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async lineItemsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		if ( !filter.order ) {
			set( filter, 'order', { company: ctx.req.headers.company } );
		}
		if ( typeof filter.order === 'object' ) {
			set( filter.order, 'company', ctx.req.headers.company );
		}
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => LineItem, { nullable: true } )
	async lineItem(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => LineItem )
	async createLineItem(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: LineItemValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		if ( entity.order ) {
			await ctx.em.populate( entity, [ 'order' ] );
			await setOrderVariables( ctx, entity.order );
			await ctx.em.flush();
			await this.notification( ctx, pubSub, this.stringOrId( entity.order.id ), 'ORDER' );
		}
		if ( entity.store ) await this.notification( ctx, pubSub, this.stringOrId( entity.store ), 'STORE' );
		if ( entity.purchase ) await this.notification( ctx, pubSub, this.stringOrId( entity.purchase ), 'PURCHASE' );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	async createLineItems(
		@Arg( 'input', () => [ LineItemValidator ] ) input: LineItemValidator[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id' ], input );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => LineItem )
	async updateLineItem(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: LineItemPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		if ( entity.order ) {
			await ctx.em.populate( entity, [ 'order' ] );
			await setOrderVariables( ctx, entity.order );
			await ctx.em.flush();
			await this.notification( ctx, pubSub, entity.order.id, 'ORDER' );
		}
		if ( entity.purchase ) await this.notification( ctx, pubSub, entity.purchase.id, 'PURCHASE' );
		if ( entity.store ) await this.notification( ctx, pubSub, entity.store.id, 'STORE' );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	async deleteLineItem(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = ( await this.findIds( ctx, [ id ] ) )[ 0 ];
		ctx.em.remove( entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		if ( entity.order ) {
			await ctx.em.populate( entity, [ 'order' ] );
			await setOrderVariables( ctx, entity.order );
			await ctx.em.flush();
			await this.notification( ctx, pubSub, this.stringOrId( entity.order.id ), 'ORDER' );
		}
		if ( entity.purchase ) await this.notification( ctx, pubSub, entity.purchase.id, 'PURCHASE' );
		if ( entity.store ) await this.notification( ctx, pubSub, entity.store.id, 'STORE' );
		return true;
	}
	
	@Query( () => String )
	async exportLineItems(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		if ( !ctx.req.headers.company ) throw 'Company is required';
		
		if ( options.filter.order ) {
			set( options.filter.order, 'company', ctx.req.headers.company );
		} else {
			set( options.filter, 'order', { company: ctx.req.headers.company } );
		}
		
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		const lineItems = await this.findAllExport( ctx, search, options, [ 'order', 'order.companyLocation',
			'order.companyLocation.address',
			'order.client' ] );
		const total = lineItems.reduce( ( sum, lineItem ) => {
			sum += lineItem.quantity * lineItem.price;
			return sum;
		}, 0 );
		const quantityTotal = lineItems.reduce( ( sum, lineItem ) => lineItem.quantity + sum, 0 );
		
		let res = await this.generateCSVString( [
			{ key: 'name', name: 'Name' },
			{ key: 'order.number', name: 'OrderNum' },
			{ key: [ 'order.client.name', 'order.client.contact' ], name: 'Client' },
			{ key: [ 'order.serviceDate', 'order.updatedAt' ], name: 'Date' },
			{ key: 'order.companyLocation.address.line1', name: 'Location' },
			{ key: 'quantity', name: 'Quantity' },
			{ key: 'price', name: 'Price' },
			{ key: 'unit', name: 'UOM' },
			{ key: 'total', name: 'Total' }
		], lineItems );
		res = res + `,,,,,${quantityTotal},,,${total}`;
		return res;
	}
}
