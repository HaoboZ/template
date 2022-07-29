import { Property, SmallIntType } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import SafeBase from '../safeBase';

@ObjectType()
export default class LocationBase<T = any> extends SafeBase<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( () => Int )
	@Property( { type: SmallIntType } )
	sequence?: number = 5;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	tax?: number;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	timezone?: string;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
