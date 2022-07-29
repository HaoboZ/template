import type { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { set } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import type { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Message from './message.entity';
import MessageValidator, { MessagePartialValidator } from './message.validator';

@Resolver( Message )
export default class MessageResolver extends BaseResolver {
	
	type = 'MESSAGE';
	Obj = Message;
	searchFields = [ 'content' ];
	
	@Query( () => [ Message ] )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async messages(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'roomId' ) roomId: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( roomId ) set( options, 'filter.room', roomId );
		if ( !options.orderBy?.length ) set( options, 'orderBy', [ 'createdAt:DESC' ] );
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async messagesCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'roomId' ) roomId: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter = {},
		@Ctx() ctx: Context
	) {
		if ( roomId ) set( filter, 'room', roomId );
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Message, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async message(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.find( ctx, info, { id } );
	}
	
	@Mutation( () => Message )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_CREATE' )
	async createMessage(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: MessageValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.create( ctx, { id }, input );
		await ctx.em.populate( entity, [ 'room', 'room.users' ] );
		const users = entity.room.users.getItems();
		users.forEach( ( { id } ) => {
			if ( id === entity.user.id ) return;
			if ( !entity.room.unreadMessagesCount[ id ] ) {
				entity.room.unreadMessagesCount[ id ] = 1;
			} else {
				entity.room.unreadMessagesCount[ id ]++;
			}
		} );
		await ctx.em.flush();
		for ( const user of users ) {
			await this.notification( ctx, pubSub, user.id );
		}
		await this.notification( ctx, pubSub, entity.room.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Message )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_UPDATE' )
	async updateMessage(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: MessagePartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		const entity = await this.update( ctx, { id }, input );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.room.id );
		return await this.find( ctx, info, { id: entity.id } );
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_UPDATE' )
	async deleteMessage(
		@Arg( 'id' ) id: string,
		@Ctx() ctx: Context,
		@PubSub() pubSub: PubSubEngine
	) {
		const entities = await this.findIds( ctx, [ id ] );
		ctx.em.remove( entities );
		await ctx.em.flush();
		await this.notifications( ctx, pubSub, entities.map( ( { room } ) => room.id ) );
		return true;
	}
	
}
