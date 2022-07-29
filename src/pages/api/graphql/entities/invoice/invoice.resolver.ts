import { endOfMonth, startOfMonth, subDays } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import { CommerceType } from '../../enums/commerceType.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { mergeCommerce } from '../commerce/commerce.resolver';
import Invoice from '../order/order.entity';
import { setOrderVariables } from '../order/order.resolver';
import InvoiceValidator, { OrderPartialValidator as InvoicePartialValidator } from '../order/order.validator';

@Resolver( Invoice )
export default class InvoiceResolver extends BaseResolver {
	
	type = 'INVOICE';
	Obj = Invoice;
	searchFields = [ 'number',
		'client.name',
		'client.contact',
		'grandTotal',
		'lineItems.name'
		// 'client.contact',
		// 'client.email',
		// 'staff.user.firstName',
		// 'client.code'*/
	];
	_company = true;
	
	@Query( () => [ Invoice ] )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_SELECT' )
	async invoices(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.INVOICE );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => [ Invoice ] )
	async clientInvoices(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !ctx.user ) throw 'No User';
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.INVOICE );
		set( options, 'filter.client.email', ctx.user.email );
		return await this.findAll( ctx, info, search, options, true );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_SELECT' )
	async invoicesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.INVOICE );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Number )
	async clientInvoicesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( !ctx.user ) throw 'No User';
		set( filter, 'type', CommerceType.INVOICE );
		set( filter, 'client.email', ctx.user.email );
		return await this.count( ctx, search, filter, true );
	}
	
	@Query( () => Invoice, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_SELECT' )
	async invoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { type: CommerceType.INVOICE, id, externalId }, true );
	}
	
	@Query( () => Invoice, { nullable: true } )
	async invoicePublic(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { type: CommerceType.INVOICE, id, externalId }, true );
	}
	
	@Query( () => [ Invoice ] )
	async invoicesPublic(
		@Arg( 'clientId' ) clientId: string,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.INVOICE );
		set( options, 'filter.client', clientId );
		set( options, 'filter.$or', [
			{ status: 'SENT' },
			{ status: 'PARTIALLY_PAID' },
			{ status: 'VIEWED' },
			{
				$and: [
					{ status: 'PAID' },
					{ updatedAt: { $gte: subDays( new Date(), 1 ).toISOString() } }
				]
			}
		] );
		return await this.findAll( ctx, info, search, options, true );
	}
	
	@Query( () => Number )
	async invoicesPublicCount(
		@Arg( 'clientId' ) clientId: string,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.INVOICE );
		set( filter, 'client', clientId );
		set( filter, '$or', [
			{ status: 'SENT' },
			{ status: 'PARTIALLY_PAID' },
			{
				$and: [
					{ status: 'PAID' },
					{ updatedAt: { $gte: subDays( new Date(), 1 ).toISOString() } }
				]
			}
		] );
		return await this.count( ctx, search, filter, true );
	}
	
	@Query( () => [ Invoice ] )
	async invoicesStatementPublic(
		@Arg( 'clientId', { nullable: true } ) clientId: string,
		@Arg( 'month', { nullable: true } ) month: Date,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.INVOICE );
		set( options, 'filter.status', { $ne: 'DRAFT' } );
		if ( clientId ) set( options, 'filter.client', clientId );
		
		if ( month ) set( options, 'filter.$or',
			[ {
				$and: [
					{ standingDate: { $lte: endOfMonth( new Date( month ) ).toISOString() } },
					{ standingDate: { $gte: startOfMonth( new Date( month ) ).toISOString() } }
				]
			}, {
				$and: [
					{ createdAt: { $lte: endOfMonth( new Date( month ) ).toISOString() } },
					{ createdAt: { $gte: startOfMonth( new Date( month ) ).toISOString() } }
				]
			} ]
		);
		
		return await this.findAll( ctx, info, search, options, true );
	}
	
	@Query( () => Number )
	async invoicesStatementPublicCount(
		@Arg( 'clientId', { nullable: true } ) clientId: string,
		@Arg( 'month', { nullable: true } ) month: Date,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.INVOICE );
		set( filter, 'status', { $ne: 'DRAFT' } );
		if ( clientId ) set( filter, 'client', clientId );
		if ( month ) set( filter, '$or',
			[ {
				$and: [
					{ standingDate: { $lte: endOfMonth( new Date( month ) ).toISOString() } },
					{ standingDate: { $gte: startOfMonth( new Date( month ) ).toISOString() } }
				]
			}, {
				$and: [
					{ createdAt: { $lte: endOfMonth( new Date( month ) ).toISOString() } },
					{ createdAt: { $gte: startOfMonth( new Date( month ) ).toISOString() } }
				]
			} ]
		);
		return await this.count( ctx, search, filter, true );
	}
	
	@Mutation( () => Invoice )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_CREATE' )
	async createInvoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: InvoiceValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		input.payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} );
		const entity = await this.create( ctx, { id, externalId }, input, { type: CommerceType.INVOICE } );
		entity.assign( { type: CommerceType.INVOICE } );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_CREATE' )
	async createInvoices(
		@Arg( 'input', () => [ InvoiceValidator ] ) input: InvoiceValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		input.forEach( ( { payments } ) => payments?.forEach( ( payment ) => {
			if ( this._company && ctx.req.headers.company )
				payment.company = ctx.req.headers.company;
		} ) );
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input, { type: CommerceType.INVOICE } );
		await Promise.all( entities.map( async ( entity ) => {
			entity.assign( { type: CommerceType.INVOICE } );
			await setOrderVariables( ctx, entity );
		} ) );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Invoice )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_UPDATE' )
	async updateInvoice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: InvoicePartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { type: CommerceType.INVOICE, id, externalId }, input );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_UPDATE' )
	async deleteInvoices(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.INVOICE } );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Invoice )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_CREATE' )
	async mergeInvoices(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.INVOICE } );
		const entity = await mergeCommerce( ctx, entities );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'INVOICES_SELECT' )
	async exportInvoices(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		set( options, 'filter.type', CommerceType.INVOICE );
		const invoices = await this.findAllExport( ctx, search, options, [ 'client' ] );
		
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
			{ key: 'dueDate', name: 'Due Date' },
			{ key: 'serviceDate', name: 'Service Date' },
			{ key: 'paidTotal', name: 'Paid Total' },
			{ key: 'subTotal', name: 'SubTotal' },
			{ key: 'taxTotal', name: 'Tax Total' },
			{ key: 'taxPercent', name: 'Tax Percent' },
			{ key: 'grandTotal', name: 'Grand Total' }
		], invoices );
	}
	
}
