import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { map, set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Client from './client.entity';
import ClientValidator, { ClientPartialValidator } from './client.validator';

@Resolver( Client )
export default class ClientResolver extends BaseResolver {
	
	type = 'CLIENT';
	Obj = Client;
	searchFields = [ 'name', 'contact', 'email', 'phone', 'cell' ];
	_company = true;
	
	@Query( () => [ Client ] )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_SELECT' )
	async clients(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'updatedAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_SELECT' )
	async clientsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Client, { nullable: true } )
	async client(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !externalId ) return null;
		return await this.find( ctx, info, { id, externalId }, true );
	}
	
	@Mutation( () => Client )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_CREATE' )
	async createClient(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'email', { nullable: true } ) email: string,
		@Arg( 'input' ) input: ClientValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id, externalId, email }, input );
		await this.createLogEntry( ctx, entity, 'Create', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_CREATE' )
	async createClients(
		@Arg( 'input', () => [ ClientValidator ] ) input: ClientValidator[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.createMulti( ctx, [ 'id', 'externalId' ], input );
		await this.createLogEntry( ctx, entities, 'Create', logging );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Mutation( () => Client )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_UPDATE' )
	async updateClient(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'externalId', { nullable: true } ) externalId: string,
		@Arg( 'input' ) input: ClientPartialValidator,
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		if ( !id && !externalId ) return null;
		const entity = await this.update( ctx, { id, externalId }, input );
		await this.createLogEntry( ctx, entity, 'Update', logging );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_UPDATE' )
	async deleteClients(
		@Arg( 'ids', () => [ String ], { nullable: true } ) ids: string[],
		@Arg( 'externalIds', () => [ String ], { nullable: true } ) externalIds: string[],
		@Arg( 'logging', { nullable: true } ) logging: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, ids || externalIds, ids ? 'id' : 'externalId' );
		await this.createLogEntry( ctx, entities, 'Delete', logging );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, map( entities, 'id' ) );
		return true;
	}
	
	@Query( () => String )
	@Authorized( 'OWNER', 'ADMIN', 'CLIENTS_SELECT' )
	async exportClients(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context
	) {
		const clients = await this.findAllExport( ctx, search, options, [ 'addresses' ] );
		
		return await this.generateCSVString( [
			{ key: 'id', name: 'ID' },
			{ key: 'contact', name: 'Contact' },
			{ key: 'name', name: 'Name' },
			{ key: 'email', name: 'Email' },
			{ key: 'phone', name: 'Phone' },
			{ key: 'cell', name: 'Cell' },
			{ key: 'companyNumber', name: 'Account Number' },
			{ key: 'addresses[0].line1', name: 'Line1' },
			{ key: 'addresses[0].city', name: 'City' },
			{ key: 'addresses[0].state', name: 'State' },
			{ key: 'addresses[0].postalCode', name: 'Zipcode' },
			{ key: 'addresses[0].country', name: 'Country' }
		], clients );
	}
}
