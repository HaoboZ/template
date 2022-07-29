import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import PolicyBase from './policy.base';

@ObjectType()
@Entity()
export default class Policy extends PolicyBase<Policy> {
	
	@Field( () => Company )
	@ManyToOne( { entity: () => Company, onDelete: 'cascade' } )
	company: Company;
	
}
