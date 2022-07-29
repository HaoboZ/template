import { Entity, ManyToOne, OneToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import Tier from '../tier/tier.entity';
import SubscribeBase from './subscribe.base';

@ObjectType()
@Entity()
export default class Subscribe extends SubscribeBase<Subscribe> {
	
	@Field( () => Company )
	@OneToOne( () => Company, 'subscription' )
	company: Company;
	
	@Field( () => Tier )
	@ManyToOne( () => Tier, { onDelete: 'cascade' } )
	tier: Tier;
	
}
