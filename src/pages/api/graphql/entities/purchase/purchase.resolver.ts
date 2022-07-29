import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, omit, partition, pick, round, set, sum } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import { PurchaseStatus } from '../../enums/purchaseStatus.enum';
import { sendNotification } from '../../global/notification.type';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { verifyCount } from '../company/company.resolver';
import LineItem from '../lineItem/lineItem.entity';
import Purchase from './purchase.entity';
import PurchaseValidator, { PurchasePartialValidator } from './purchase.validator';

@Resolver( Purchase )
export default class PurchaseResolver extends BaseResolver {
	
	type = 'PURCHASE';
	Obj = Purchase;
	searchFields = [ 'number', 'menu.vendorName', 'grandTotal', 'lineItems.name' ];
	_company = true;
	
	@Query( () => [ Purchase ] )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_SELECT' )
	async purchases(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_SELECT' )
	async purchasesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Purchase, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_SELECT' )
	async purchase(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Query( () => Purchase, { nullable: true } )
	async purchasePublic(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id }, true );
	}
	
	@Mutation( () => Purchase )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_CREATE' )
	async createPurchase(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: PurchaseValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await verifyCount( ctx, entity, 'purchase' );
		await setPurchaseVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_CREATE' )
	async createPurchases(
		@Arg( 'input', () => [ PurchaseValidator ] ) input: PurchaseValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id' ], input );
		await verifyCount( ctx, entities, 'purchase' );
		await Promise.all( entities.map( ( entity ) => setPurchaseVariables( ctx, entity ) ) );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Purchase )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_UPDATE' )
	async updatePurchase(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: PurchasePartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await setPurchaseVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_UPDATE' )
	async deletePurchases(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		ctx.em.remove( entities );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Purchase )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_UPDATE' )
	async mergePurchases(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const { em, req } = ctx;
		
		const repo = em.getRepository( Purchase );
		const purchases = await repo.find( {
			id     : { $in: ids },
			company: req.headers.company
		} );
		
		await Promise.all( purchases.map( ( purchase ) => em.populate( purchase, [ 'lineItems' ] ) ) );
		const newPurchase = new Purchase().assign( pick( purchases[ 0 ], [
			'notes',
			'po',
			'terms',
			'standing',
			'standingDue',
			'standingData',
			'duePeriod',
			'standingDate',
			'dueDate',
			'serviceDate',
			'attachments',
			'taxPercent',
			'noPrices',
			'companyLocation',
			'vendorAddress',
			'shippingAddress',
			'menu',
			'lineItems',
			'company'
		] ), { em } );
		purchases.forEach( ( purchase ) => {
			purchase.lineItems.getItems().forEach( ( lineItem ) =>
				newPurchase.lineItems.add( new LineItem().assign( omit( lineItem, [ 'id' ] ), { em } ) ) );
		} );
		
		await setPurchaseVariables( ctx, newPurchase );
		em.persist( newPurchase );
		await em.flush();
		await sendNotification( pubSub, 'PURCHASE', {
			id     : newPurchase.id,
			message: 'CREATE',
			company: req.headers.company
		} );
		return await this.find( ctx, info, { id: newPurchase.id } );
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'PURCHASES_SELECT' )
	async exportPurchases(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		const purchases = await this.findAllExport( ctx, search, options, [ 'menu' ] );
		
		return await this.generateCSVString( [
			{ key: 'id', name: 'ID' },
			{ key: 'number', name: 'Number' },
			{ key: 'menu.vendorName', name: 'Vendor Name' },
			{ key: 'menu.vendorContact', name: 'Vendor Contact' },
			{ key: 'menu.vendorEmail', name: 'Vendor Email' },
			{ key: 'menu.vendorPhone', name: 'Vendor Phone' },
			{ key: 'serviceDate', name: 'Service Date' },
			{ key: 'status', name: 'Status' },
			{ key: 'deliveryStatus', name: 'Delivery' },
			{ key: 'grandTotal', name: 'Grand Total' }
		], purchases );
	}
	
}

async function setPurchaseVariables( { em }: Context, purchase: Purchase ) {
	await em.populate( purchase, [ 'lineItems', 'lineItems.prices' ] );
	
	const lineItems = purchase.lineItems.getItems();
	
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
	
	purchase.subTotal = round( sum( totals ), 2 );
	
	purchase.taxTotal = round( totals.reduce( ( sum, total, index ) =>
		sum + total * ( ( lineItems[ index ].tax === null
			? purchase.taxPercent
			: lineItems[ index ].tax ) || 0 ) / 100, 0 ), 2 );
	
	purchase.grandTotal = round( purchase.subTotal + purchase.taxTotal, 2 );
	
	if ( purchase.cancelled ) {
		purchase.status = PurchaseStatus.CANCELLED;
	} else if ( purchase.received ) {
		purchase.status = PurchaseStatus.RECEIVED;
	} else if ( purchase.issues ) {
		purchase.status = PurchaseStatus.ISSUES;
	} else if ( purchase.confirmed ) {
		purchase.status = PurchaseStatus.CONFIRMED;
	} else if ( purchase.declined ) {
		purchase.status = PurchaseStatus.DECLINED;
	} else if ( purchase.standingActive ) {
		purchase.status = PurchaseStatus.STANDING;
	} else if ( purchase.viewed ) {
		purchase.status = PurchaseStatus.VIEWED;
	} else if ( purchase.sent ) {
		purchase.status = PurchaseStatus.SENT;
	} else {
		purchase.status = PurchaseStatus.DRAFT;
	}
	em.persist( purchase );
}
