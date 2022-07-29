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
import Estimate from '../order/order.entity';
import { setOrderVariables } from '../order/order.resolver';
import EstimateValidator, { OrderPartialValidator as EstimatePartialValidator } from '../order/order.validator';

@Resolver( Estimate )
export default class EstimateResolver extends BaseResolver {
	
	type = 'ESTIMATE';
	Obj = Estimate;
	searchFields = [ 'number', 'client.name', 'client.contact', 'grandTotal', 'lineItems.name'
		/*, 'client.name', 'client.contact', 'client.email', 'staff.user.firstName', 'client.code'*/ ];
	_company = true;
	
	@Query( () => [ Estimate ] )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_SELECT' )
	async estimates(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.ESTIMATE );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => [ Estimate ] )
	async clientEstimates(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !ctx.user ) throw 'No User';
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		set( options, 'filter.type', CommerceType.ESTIMATE );
		set( options, 'filter.client.email', ctx.user.email );
		return await this.findAll( ctx, info, search, options, true );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_SELECT' )
	async estimatesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		set( filter, 'type', CommerceType.ESTIMATE );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Number )
	async clientEstimatesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( !ctx.user ) throw 'No User';
		set( filter, 'type', CommerceType.ESTIMATE );
		set( filter, 'client.email', ctx.user.email );
		return await this.count( ctx, search, filter, true );
	}
	
	@Query( () => Estimate, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_SELECT' )
	async estimate(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { type: CommerceType.ESTIMATE, id } );
	}
	
	@Query( () => Estimate, { nullable: true } )
	async estimatePublic(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { type: CommerceType.ESTIMATE, id }, true );
	}
	
	@Mutation( () => Estimate )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_CREATE' )
	async createEstimate(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: EstimateValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input, { type: CommerceType.ESTIMATE } );
		entity.assign( { type: CommerceType.ESTIMATE } );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_CREATE' )
	async createEstimates(
		@Arg( 'input', () => [ EstimateValidator ] ) input: EstimateValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		input.forEach( ( item ) => item.type = CommerceType.ESTIMATE );
		const entities = await this.createMulti( ctx, [ 'id' ], input, { type: CommerceType.ORDER } );
		await Promise.all( entities.map( async ( entity ) => {
			entity.assign( { type: CommerceType.ESTIMATE } );
			await setOrderVariables( ctx, entity );
		} ) );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Estimate )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_UPDATE' )
	async updateEstimate(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: EstimatePartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { type: CommerceType.ESTIMATE, id }, input );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_UPDATE' )
	async deleteEstimates(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.ESTIMATE } );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Estimate )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_CREATE' )
	async mergeEstimates(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids, undefined, { type: CommerceType.ESTIMATE } );
		const entity = await mergeCommerce( ctx, entities );
		await setOrderVariables( ctx, entity );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'ESTIMATES_SELECT' )
	async exportEstimates(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		set( options, 'filter.type', CommerceType.ESTIMATE );
		
		const estimates = await this.findAllExport( ctx, search, options, [ 'client' ] );
		
		return await this.generateCSVString( [
			{ key: 'id', name: 'ID' },
			{ key: 'number', name: 'Number' },
			{ key: 'client.id', name: 'Client ID' },
			{ key: 'client.name', name: 'Client Name' },
			{ key: 'client.contact', name: 'Client Contact' },
			{ key: 'client.email', name: 'Client Email' },
			{ key: 'client.phone', name: 'Client Phone' },
			{ key: 'client.companyNumber', name: 'Client Company Number' },
			{ key: 'serviceDate', name: 'Service Date' },
			{ key: 'status', name: 'Status' },
			{ key: 'dueDate', name: 'Due Date' },
			{ key: 'deliveryStatus', name: 'Delivery' },
			{ key: 'subTotal', name: 'SubTotal' },
			{ key: 'taxTotal', name: 'Tax Total' },
			{ key: 'taxPercent', name: 'Tax Percent' },
			{ key: 'grandTotal', name: 'Grand Total' }
		], estimates );
	}
	
}
