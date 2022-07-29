import { GraphQLResolveInfo } from 'graphql';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import User from './user.entity';
import { UserPartialValidator } from './user.validator';

@Resolver( User )
export default class UserResolver extends BaseResolver {
	
	type = 'USER';
	Obj = User;
	searchFields = [ 'email', 'firstName', 'lastName' ];
	
	@Query( () => [ User ] )
	@Authorized( 'SU' )
	async users(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'SU' )
	async usersCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => User, { nullable: true } )
	async user(
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		try {
			return await this.find( ctx, info, { email: ctx.token.email } );
		} catch {
			return null;
		}
	}
	
	@Query( () => Boolean )
	async userExists(
		@Arg( 'email' ) email: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		try {
			await this.find( ctx, info, { email } );
			return true;
		} catch {
			return false;
		}
	}
	
	@Mutation( () => User )
	async updateUser(
		@Arg( 'input' ) input: UserPartialValidator,
		@Ctx() ctx: Context
		// @Info() info: GraphQLResolveInfo,
	) {
		if ( !ctx.token ) throw 'User is not Authenticated';
		let user: User = ctx.user;
		if ( !ctx.user ) user = new User();
		user.assign( {
			...this.condense( input ),
			externalId: ctx.token.uid
		}, { em: ctx.em } );
		
		ctx.em.persist( user );
		await ctx.em.flush();
		return user;
	}
	
}
