import { Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class DemoBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	name: string;
	
}
