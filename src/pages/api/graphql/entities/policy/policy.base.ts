import { Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class PolicyBase<T = any> extends Base<T> {
	
	@Field()
	@Property( { type: TextType } )
	policy: string;
	
}
