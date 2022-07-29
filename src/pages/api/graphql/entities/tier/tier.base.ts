import { JsonType, Property, SmallIntType } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import Base from '../base';

@ObjectType()
export default class TierBase<T = any> extends Base<T> {
	
	@Field( () => Int )
	@Property( { type: SmallIntType } )
	sequence: number;
	
	@Field()
	@Property( { unique: true } )
	name: string;
	
	@Field()
	@Property()
	price: number;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType } )
	externalIds: any;
	
	@Field()
	@Property()
	description: string;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType } )
	descriptions: any;
	
}
