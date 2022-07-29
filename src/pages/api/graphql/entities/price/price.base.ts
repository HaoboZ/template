import { DoubleType, JsonType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import Base from '../base';

@ObjectType()
export default class PriceBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	isPercent?: boolean;
	
	@Field()
	@Property( { type: DoubleType } )
	value: number;
	
	@Field()
	@Property( { default: 1 } )
	quantity?: number = 1;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
}
