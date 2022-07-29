import { JsonType, Property, UuidType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

@ObjectType()
export default class RoomBase<T = any> extends SafeBase<T> {
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	name?: string;
	
	@Field( { nullable: true } )
	@Property( { type: UuidType, unique: true, nullable: true } )
	linkedId?: string;
	
	@Field()
	@Property()
	visible?: boolean = true;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType } )
	unreadMessagesCount = {};
	
}
