import { ArrayType, Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import SafeBase from '../safeBase';

@ObjectType()
export default class MenuBase<T = any> extends SafeBase<T> {
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	name?: string;
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	categories?: string[] = [];
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorName?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorContact?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorPhone?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorEmail?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	vendorLogo?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	vendorBanner?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	vendorDescription?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorUrl?: string;
	
	@Field()
	@Property()
	active?: boolean = false;
	
}
