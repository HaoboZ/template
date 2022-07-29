import { Collection } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import CategoryBase from '../category/category.base';
import ItemBase from '../item/item.base';
import ModifierGroup from '../modifierGroup/modifierGroup.entity';
import PriceBase from '../price/price.base';
import UomBase from '../uom/uom.base';
import LineItemBase from './lineItem.base';

@ObjectType()
export default class SimpleLineItem extends LineItemBase {
	
	@Field( () => ItemBase, { nullable: true } )
	item?: ItemBase;
	
	@Field( () => UomBase, { nullable: true } )
	uom?: UomBase;
	
	@Field( () => CategoryBase, { nullable: true } )
	category?: CategoryBase;
	
	@Field( () => [ PriceBase ] )
	prices? = new Collection<PriceBase>( this );
	
	@Field( () => [ ModifierGroup ] )
	modifierGroups? = new Collection<ModifierGroup>( this );
	
}
