import type { GraphQLResolveInfo } from 'graphql';
import { set } from 'lodash-es';
import { Arg, Ctx, Info, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import BaseResolver from '../base.resolver';
import Tier from './tier.entity';

@Resolver( Tier )
export default class TierResolver extends BaseResolver {
	
	type = 'TIER';
	Obj = Tier;
	searchFields = [ 'name', 'description' ];
	
	@Query( () => [ Tier ] )
	async tiers(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'sequence:ASC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Tier, { nullable: true } )
	async tier(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
}
