import { ArrayType, DoubleType, Enum, JsonType, Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { StoreType } from '../../enums/storeType.enum';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

@ObjectType()
export default class StoreBase<T = any> extends SafeBase<T> {
	
	static jsons = [ 'hours', 'metadata', 'rewards' ];
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	banner?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	description?: string;
	
	@Field()
	@Property()
	active?: boolean = false;
	
	@Field()
	@Property()
	minDelivery?: number = 0;
	
	@Field()
	@Property( { type: DoubleType } )
	taxPercent?: number = 0;
	
	@Field( () => [ StoreType ] )
	@Enum( { items: () => StoreType, type: 'string', array: true } )
	type?: StoreType[] = [];
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	city?: string[] = [];
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	country?: string[] = [];
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	zipCode?: string[] = [];
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	hours?: any = {};
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	rewards?: any = {};
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
}
