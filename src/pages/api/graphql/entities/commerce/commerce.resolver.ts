import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, omit, pick } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import LineItem from '../lineItem/lineItem.entity';
import Commerce from '../order/order.entity';
import { setOrderVariables } from '../order/order.resolver';
import CommerceValidator, { OrderPartialValidator as CommercePartialValidator } from '../order/order.validator';
import Price from '../price/price.entity';

@Resolver( Commerce )
export default class CommerceResolver extends BaseResolver {
	
	type = 'COMMERCE';
	Obj = Commerce;
	_company = true;
	
	@Query( () => [ Commerce ] )
	@Authorized( 'OWNER', 'ADMIN' )
	async commerces(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN' )
	async commercesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Commerce, { nullable: true } )
	async commerce(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'oldHash', { nullable: true } ) oldHash: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId, oldHash }, true );
	}
	
	@Mutation( () => Commerce )
	@Authorized( 'OWNER', 'ADMIN' )
	async createCommerce(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: CommerceValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		input.payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} );
		const entity = await this.create( ctx, { id, externalId }, input );
		await setOrderVariables( ctx, entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		await this.notification( ctx, pubSub, entity.id, entity.type );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN' )
	async createCommerces(
		@Arg( 'input', () => [ CommerceValidator ] ) input: CommerceValidator[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		input.forEach( ( { payments } ) => payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} ) );
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input );
		await Promise.all( entities.map( ( entity ) => setOrderVariables( ctx, entity ) ) );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		await this.notifications( ctx, pubSub, map( entities, 'id' ), map( entities, 'type' ) );
		return true;
	}
	
	@Mutation( () => Commerce )
	@Authorized( 'OWNER', 'ADMIN' )
	async updateCommerce(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: CommercePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input );
		await setOrderVariables( ctx, entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		await this.notification( ctx, pubSub, entity.id, entity.type );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN' )
	async deleteCommerces(
		@Arg( 'ids', () => [ String ], { nullable: true } ) ids: string[],
		@Arg( 'externalIds', () => [ String ], { nullable: true } ) externalIds: string[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids || externalIds, ids ? 'id' : 'externalId' );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		await this.notifications( ctx, pubSub, map( entities, 'id' ), map( entities, 'type' ) );
		return true;
	}
	
	@Mutation( () => Commerce )
	@Authorized( 'OWNER', 'ADMIN' )
	async mergeCommerces(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		const entity = await mergeCommerce( ctx, entities );
		await setOrderVariables( ctx, entity );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id, entity.type );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
}

export async function mergeCommerce( { em }: Context, commerces: Commerce[] ) {
	await Promise.all( commerces.map( ( commerce ) =>
		em.populate( commerce, [ 'lineItems', 'prices' ] ) ) );
	const newCommerce = new Commerce().assign( pick( commerces[ 0 ], [
		'type',
		'notes',
		'po',
		'terms',
		'standing',
		'standingDue',
		'standingData',
		'duePeriod',
		'standingDate',
		'dueDate',
		'serviceType',
		'serviceDate',
		'attachments',
		'dateSent',
		'taxPercent',
		'client',
		'companyLocation',
		'clientAddress',
		'shippingAddress',
		'policy',
		'staff',
		'company',
		'gateway',
		'metadata.privateNote'
	] ), { em } );
	commerces.forEach( ( commerce ) => {
		commerce.lineItems.getItems().forEach( ( lineItem ) =>
			newCommerce.lineItems.add( new LineItem().assign( omit( lineItem, [ 'id' ] ), { em } ) ) );
		commerce.prices.getItems().forEach( ( price ) =>
			newCommerce.prices.add( new Price().assign( omit( price, [ 'id' ] ), { em } ) ) );
	} );
	return newCommerce;
}
