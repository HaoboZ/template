import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import ClientBase from '../client/client.base';
import Company from '../company/company.entity';
import MessageBase from '../message/message.base';
import User from '../user/user.entity';
import RoomBase from './room.base';

@ObjectType()
class RoomMessage extends MessageBase {
	
	@Field( () => User, { nullable: true } )
	user?: User;
	
	@Field( () => ClientBase, { nullable: true } )
	client?: ClientBase;
	
}

@ObjectType()
@Entity()
export default class Room extends RoomBase<Room> {
	
	@Field( () => User, { nullable: true } )
	@ManyToOne( () => User, { onDelete: 'set null', nullable: true } )
	user?: User;
	
	@Field( () => ClientBase, { nullable: true } )
	@ManyToOne( 'Client', { onDelete: 'set null', nullable: true } )
	client?: ClientBase;
	
	@Field( () => [ User ] )
	@ManyToMany( () => User )
	users? = new Collection<User>( this );
	
	@Field( () => [ RoomMessage ] )
	@OneToMany( 'Message', 'room', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	messages? = new Collection<RoomMessage>( this );
	
	@Field( () => Company, { nullable: true } )
	@ManyToOne( () => Company, { onDelete: 'cascade', nullable: true } )
	company?: Company;
	
}
