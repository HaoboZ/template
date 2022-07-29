import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Address from './address.entity';
import AddressValidator, { AddressPartialValidator } from './address.validator';

@Resolver( Address )
export default class AddressResolver extends BaseResolver {
	
	type = 'ADDRESS';
	Obj = Address;
	searchFields = [ 'line1', 'line2', 'city', 'state', 'country', 'postalCode' ];
	
	@Query( () => [ Address ] )
	async addresses(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async addressesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Address, { nullable: true } )
	async address(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => Address )
	async createAddress(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: AddressValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	async createAddresses(
		@Arg( 'input', () => [ AddressValidator ] ) input: AddressValidator[],
		@Ctx() ctx: Context
	) {
		await this.createMulti( ctx, [ 'id' ], input );
		await ctx.em.flush();
		return true;
	}
	
	@Mutation( () => Address )
	async updateAddress(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: AddressPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	async deleteAddresses(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context
	) {
		const entities = await this.findIds( ctx, ids );
		ctx.em.remove( entities );
		await ctx.em.flush();
		return true;
	}
	
}
