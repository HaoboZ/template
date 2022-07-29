import { GraphQLResolveInfo } from 'graphql';
import { set } from 'lodash-es';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Log from './log.entity';

@Resolver( Log )
export default class LogResolver extends BaseResolver {
	
	type = 'LOG';
	Obj = Log;
	searchFields = [ 'name', 'text' ];
	_company = true;
	
	@Query( () => [ Log ] )
	async logs(
		@Arg( 'documentId', { nullable: true } ) documentId: string,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( documentId ) {
			set( options, 'filter.documentId', documentId );
		}
		set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	async logsCount(
		@Arg( 'documentId', { nullable: true } ) documentId: string,
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( documentId ) {
			set( filter, 'documentId', documentId );
		}
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Log, { nullable: true } )
	async log(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => Boolean )
	async createLog(
		@Arg( 'id' ) id: string,
		@Arg( 'companyId' ) companyId: string,
		@Arg( 'action', { nullable: true } ) action: string,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context
	) {
		await this.createLogEntry( ctx, { id, company: { id: companyId } }, action || 'Viewed', logging );
		await ctx.em.flush();
		return true;
	}
	
}
