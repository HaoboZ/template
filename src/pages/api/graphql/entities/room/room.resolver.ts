import { GraphQLResolveInfo } from 'graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { differenceBy, map } from 'lodash-es';
import { Arg, Authorized, Ctx, Info, Mutation, PubSub, Query, Resolver } from 'type-graphql';
import ConditionalOptions from '../../conditionalOptions';
import { Context } from '../../context';
import JsonScalar from '../../scalars/json.scalar';
import BaseResolver from '../base.resolver';
import Message from '../message/message.entity';
import User from '../user/user.entity';
import Room from './room.entity';
import RoomValidator, { RoomPartialValidator } from './room.validator';

@Resolver( Room )
export default class RoomResolver extends BaseResolver {
	
	type = 'ROOM';
	Obj = Room;
	searchFields = [ 'name' ];
	_company = true;
	
	@Query( () => [ Room ] )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async rooms(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'options', { nullable: true } ) options: ConditionalOptions = {},
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		return await this.findAll( ctx, info, search, options );
	}
	
	@Query( () => Number )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async roomsCount(
		@Arg( 'search', { nullable: true } ) search: string,
		@Arg( 'filter', () => JsonScalar, { nullable: true } ) filter: any,
		@Ctx() ctx: Context
	) {
		return await this.count( ctx, search, filter );
	}
	
	@Query( () => Room, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async room(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'linkedId', { nullable: true } ) linkedId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		if ( !id && !linkedId ) return null;
		return await this.find( ctx, info, { id, linkedId } );
	}
	
	@Query( () => Number, { nullable: true } )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_SELECT' )
	async roomsUnreadCount(
		@Arg( 'userId' ) userId: string,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo
	) {
		const rooms = await this.findAll( ctx, info, undefined,
			{ filter: { users: userId } } );
		return rooms.reduce( ( count, room ) => count + room.unreadMessagesCount[ userId ] || 0, 0 );
	}
	
	@Mutation( () => Room )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_CREATE' )
	async createRoom(
		@Arg( 'id', { nullable: true } ) id: string,
		@Arg( 'input' ) input: RoomValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		let users;
		const entity = await this.create( ctx, { id }, input, undefined, async ( entity ) => {
			await ctx.em.populate( entity, [ 'users' ] );
			users = entity.users.getItems();
		} );
		const fetchEntity = await this.find( ctx, info, { id: entity.id } );
		const deletedUsers = differenceBy<User, User>( users, fetchEntity.users.getItems(), 'id' );
		const addedUsers = differenceBy<User, User>( fetchEntity.users.getItems(), users, 'id' );
		ctx.em.persist( [
			...deletedUsers.map( ( user ) => new Message().assign( {
				room   : fetchEntity.id,
				content: `${user.firstName} ${user.lastName} left the room`
			}, { em: ctx.em } ) ),
			...addedUsers.map( ( user ) => new Message().assign( {
				room   : fetchEntity.id,
				content: `${user.firstName} ${user.lastName} joined the room`
			}, { em: ctx.em } ) )
		] );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return fetchEntity;
	}
	
	@Mutation( () => Room )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_UPDATE' )
	async updateRoom(
		@Arg( 'id' ) id: string,
		@Arg( 'input' ) input: RoomPartialValidator,
		@Ctx() ctx: Context,
		@Info() info: GraphQLResolveInfo,
		@PubSub() pubSub: PubSubEngine
	) {
		let users;
		const entity = await this.update( ctx, { id }, input, async ( entity ) => {
			await ctx.em.populate( entity, [ 'users' ] );
			users = entity.users.getItems();
		} );
		const fetchEntity = await this.find( ctx, info, { id: entity.id } );
		const deletedUsers = differenceBy<User, User>( users, fetchEntity.users.getItems(), 'id' );
		const addedUsers = differenceBy<User, User>( fetchEntity.users.getItems(), users, 'id' );
		ctx.em.persist( [
			...deletedUsers.map( ( user ) => new Message().assign( {
				room   : fetchEntity.id,
				content: `${user.firstName} ${user.lastName} left the room`
			}, { em: ctx.em } ) ),
			...addedUsers.map( ( user ) => new Message().assign( {
				room   : fetchEntity.id,
				content: `${user.firstName} ${user.lastName} joined the room`
			}, { em: ctx.em } ) )
		] );
		await ctx.em.flush();
		await this.notification( ctx, pubSub, entity.id );
		return fetchEntity;
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'OWNER', 'ADMIN', 'CHATS_UPDATE' )
	async deleteRooms(
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
