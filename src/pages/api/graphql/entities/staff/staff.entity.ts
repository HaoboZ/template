import { Collection, Entity, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import Location from '../location/location.entity';
import UserBase from '../user/user.base';
import StaffBase from './staff.base';

@ObjectType()
@Entity()
export default class Staff extends StaffBase<Staff> {
	
	@Field( () => UserBase, { nullable: true } )
	@ManyToOne( 'User', { nullable: true, onDelete: 'cascade' } )
	user?: UserBase;
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => [ Location ] )
	@ManyToMany( () => Location, undefined, {
		orderBy: { sequence: 'asc' }
	} )
	locations? = new Collection<Location>( this );
	
}
