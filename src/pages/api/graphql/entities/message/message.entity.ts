import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import ClientBase from '../client/client.base';
import Room from '../room/room.entity';
import User from '../user/user.entity';
import MessageBase from './message.base';

@ObjectType()
@Entity()
export default class Message extends MessageBase<Message> {
	
	@Field( () => Room )
	@ManyToOne( () => Room, { onDelete: 'cascade' } )
	room: Room;
	
	@Field( () => User, { nullable: true } )
	@ManyToOne( () => User, { onDelete: 'set null', nullable: true } )
	user?: User;
	
	@Field( () => ClientBase, { nullable: true } )
	@ManyToOne( 'Client', { onDelete: 'set null', nullable: true } )
	client?: ClientBase;
	
}
