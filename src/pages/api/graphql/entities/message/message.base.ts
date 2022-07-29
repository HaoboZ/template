import { Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class MessageBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	content: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	notified?: Date;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	attachment?: string;
	
}
