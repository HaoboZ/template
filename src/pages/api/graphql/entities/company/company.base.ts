import { Enum, JsonType, Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { CompanySource } from '../../enums/companySource.enum';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

@ObjectType()
export default class CompanyBase<T = any> extends SafeBase<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	contact?: string;
	
	@Field()
	@Property()
	email: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	phone?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	description?: string;
	
	@Field( () => CompanySource )
	@Enum( { items: () => CompanySource, type: 'string' } )
	source?: CompanySource = CompanySource.WEBSITE;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	logo?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	banner?: string;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	subdomain?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	website?: string;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
}
