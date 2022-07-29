import { DoubleType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class AddressBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	line1: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	line2?: string;
	
	@Field()
	@Property()
	city: string;
	
	@Field()
	@Property()
	state: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	postalCode?: string;
	
	@Field()
	@Property()
	country: string;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	lat?: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	lng?: number;
	
}
