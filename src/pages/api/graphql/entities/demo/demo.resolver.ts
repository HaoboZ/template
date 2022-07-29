import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Demo from './demo.entity';
import DemoValidator, { DemoPartialValidator } from './demo.validator';

@Resolver( Demo )
export default class DemoResolver extends BaseResolver {
	
	type = 'DEMO';
	Obj = Demo;
	searchFields = [ 'name' ];
	
	@Query( () => [ Demo ] )
	@Authorized( 'SU' )
	async demos(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'SU' )
	async demosCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Demo, { nullable: true } )
	@Authorized( 'SU' )
	async demo(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => Demo )
	@Authorized( 'SU' )
	async createDemo(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: DemoValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'SU' )
	async createDemos(
		@Arg( 'input', () => [ DemoValidator ] ) input: DemoValidator[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id' ], input );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Demo )
	@Authorized( 'SU' )
	async updateDemo(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: DemoPartialValidator,
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
	@Authorized( 'SU' )
	async deleteDemos(
		@Arg( 'ids', () => [ String ] ) ids: string[],
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
}
