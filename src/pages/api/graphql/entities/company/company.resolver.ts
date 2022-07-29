import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import { Permissions } from '../../enums/permissions.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Staff from '../staff/staff.entity';
import Company from './company.entity';
import CompanyValidator, { CompanyPartialValidator } from './company.validator';

@Resolver( Company )
export default class CompanyResolver extends BaseResolver {
	
	type = 'COMPANY';
	Obj = Company;
	searchFields = [ 'name', 'contact', 'email', 'phone', 'description', 'source' ];
	
	@Query( () => [ Company ] )
	@Authorized( 'SU' )
	async companies(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'SU' )
	async companiesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Company, { nullable: true } )
	@Authorized( 'SU' )
	async company(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => Company )
	async createCompany(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: CompanyValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		if ( entity._new ) {
			ctx.em.persist( new Staff().assign( {
				company    : entity.id,
				user       : ctx.user.id,
				permissions: [ Permissions.OWNER ],
				email      : ctx.user.email
			}, { em: ctx.em } ) );
			await this.notification( ctx, pubSub, ctx.user.id, 'USER' );
		}
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Company )
	@Authorized( 'OWNER' )
	async updateCompany(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: CompanyPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER' )
	async deleteCompany(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, [ id ] );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
}

export async function verifyCount( { req, em }: Context, entity, key: string ) {
	if ( !entity._new ) return;
	const repo = em.getRepository( Company );
	const company = await repo.findOne( { id: req.headers.company }, { populate: [ 'subscription.tier' ] } );
	if ( !company ) return;
	const limit = company.subscription?.tier?.descriptions[ key ][ 0 ];
	if ( limit === true ) return;
	if ( limit === false ) throw new Error( 'Limit reached' );
	const total = company.metadata[ key ]?.[ limit % 1 ? 1 : 0 ] || 0;
	if ( total >= Math.floor( limit ) ) throw new Error( 'Limit reached' );
	if ( !company.metadata[ key ] ) company.metadata[ key ] = [ 0, 0 ];
	company.metadata[ key ][ 0 ]++;
	company.metadata[ key ][ 1 ]++;
	em.persist( company );
}
