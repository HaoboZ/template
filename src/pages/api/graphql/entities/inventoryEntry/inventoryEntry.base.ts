import { DoubleType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class InventoryEntryBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field()
	@Property( { type: DoubleType } )
	price: number;
	
	@Field()
	@Property( { type: DoubleType } )
	quantity: number;
	
	@Field()
	@Property()
	sku: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorSku?: string;
	
}
