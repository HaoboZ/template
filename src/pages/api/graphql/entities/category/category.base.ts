import { Property, SmallIntType, TextType } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import SafeBase from '../safeBase';

@ObjectType()
export default class CategoryBase<T = any> extends SafeBase<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	description?: string;
	
	@Field( () => Int )
	@Property( { type: SmallIntType } )
	sequence?: number = 5;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
