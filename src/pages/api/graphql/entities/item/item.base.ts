import { Enum, Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { InventoryType } from '../../enums/inventoryType.enum';
import SafeBase from '../safeBase';

@ObjectType()
export default class ItemBase<T = any> extends SafeBase<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	description?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	image?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	taxable?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	isInventory?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	isHidden?: boolean;
	
	@Field( () => InventoryType, { nullable: true } )
	@Enum( { items: () => InventoryType, type: 'string', nullable: true } )
	type?: InventoryType;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
