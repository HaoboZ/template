import type { GraphQLResolveInfo } from 'graphql';
import { set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Price from './price.entity';
import PriceValidator, { PricePartialValidator } from './price.validator';

@Resolver( Price )
export default class PriceResolver extends BaseResolver {
	
	type = 'PRICE';
	Obj = Price;
	searchFields = [ 'name' ];
	_company = true;
	
	@Query( () => [ Price ] )
	async prices(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		if ( this._company ) set( options, 'filter.company', ctx.req.headers.company );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async pricesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Price, { nullable: true } )
	async price(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id }, true );
	}
	
	@Mutation( () => Price )
	async createPrice(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: PriceValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'PRICES_CREATE' )
	async createPrices(
		@Arg( 'input', () => [ PriceValidator ] ) input: PriceValidator[],
		@Ctx() ctx: Context
	) {
		await this.createMulti( ctx, [ 'id' ], input );
		await ctx.em.flush();
		return true;
	}
	
	@Mutation( () => Price )
	async updatePrice(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: PricePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'PRICES_UPDATE' )
	async deletePrices(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context
	) {
		const entities = await this.findIds( ctx, ids );
		ctx.em.remove( entities );
		await ctx.em.flush();
		return true;
	}
	
}
