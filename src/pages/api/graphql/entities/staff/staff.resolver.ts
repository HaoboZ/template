import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import { verifyCount } from '../company/company.resolver';
import Staff from './staff.entity';
import StaffValidator, { StaffPartialValidator } from './staff.validator';

@Resolver( Staff )
export default class StaffResolver extends BaseResolver {
	
	type = 'STAFF';
	Obj = Staff;
	searchFields = [ 'email', 'user.firstName', 'user.lastName', 'user.email' ];
	_company = true;
	
	@Query( () => [ Staff ] )
	@Authorized( 'OWNER' )
	async staffs(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER' )
	async staffsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Staff, { nullable: true } )
	async staff(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'code', { nullable: true } ) code: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !code ) return null;
		return await this.find( ctx, info, { id, code }, true );
	}
	
	@Mutation( () => Staff )
	@Authorized( 'OWNER' )
	async createStaff(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: StaffValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await verifyCount( ctx, entity, 'staff' );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Staff )
	@Authorized( 'OWNER' )
	async updateStaff(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: StaffPartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER' )
	async deleteStaffs(
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
	
}
