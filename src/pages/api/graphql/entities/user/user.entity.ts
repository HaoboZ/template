import { Cascade, Collection, Entity, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Staff from '../staff/staff.entity';
import UserBase from './user.base';

@ObjectType()
@Entity()
export default class User extends UserBase<User> {
	
	@Field( () => [ Staff ] )
	@OneToMany( () => Staff, 'user', {
		cascade      : [ Cascade.ALL ],
		orderBy      : { createdAt: 'desc' },
		orphanRemoval: true
	} )
	staffs? = new Collection<Staff>( this );
	
}
