import { JsonType, Property, TextType } from '@mikro-orm/core';
import { customAlphabet } from 'nanoid';
import { Field, ObjectType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

const nanoid = customAlphabet( '23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6 );

@ObjectType()
export default class ClientBase<T = any> extends SafeBase<T> {
	
	static jsons = [ 'metadata' ];
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	name?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	contact: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	email?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	phone?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	cell?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	logo?: string;
	
	@Field()
	@Property()
	statement?: boolean = false;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	code?: string = nanoid();
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
