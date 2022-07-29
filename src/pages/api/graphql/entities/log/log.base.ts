import { Property, TextType, UuidType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class LogBase<T = any> extends Base<T> {
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	table?: string;
	
	@Field( { nullable: true } )
	@Property( { type: UuidType, nullable: true } )
	documentId?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	name?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	text?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	ip?: string;
	
}
