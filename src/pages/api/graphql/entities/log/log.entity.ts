import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import User from '../user/user.entity';
import LogBase from './log.base';

@ObjectType()
@Entity()
export default class Log extends LogBase<Log> {
	
	@Field( () => Company, { nullable: true } )
	@ManyToOne( () => Company, { nullable: true, onDelete: 'cascade' } )
	company?: Company;
	
	@Field( () => User, { nullable: true } )
	@ManyToOne( () => User, { nullable: true } )
	user?: User;
	
}
