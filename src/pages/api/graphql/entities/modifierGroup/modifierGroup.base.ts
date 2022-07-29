import { DoubleType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class ModifierGroupBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	min?: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	max?: number;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
