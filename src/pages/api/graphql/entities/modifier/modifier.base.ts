import { DoubleType, JsonType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import Base from '../base';

@ObjectType()
export default class ModifierBase<T = any> extends Base<T> {
	
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
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	min?: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	max?: number;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
