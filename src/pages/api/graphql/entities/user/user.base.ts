import { Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import SafeBase from '../safeBase';

@ObjectType()
export default class UserBase<T = any> extends SafeBase<T> {
	
	@Field()
	@Property( { unique: true } )
	email: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	firstName?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	lastName?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	image?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	lastLogin?: Date;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
