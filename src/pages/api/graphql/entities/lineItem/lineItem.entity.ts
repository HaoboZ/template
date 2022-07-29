import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import CategoryBase from '../category/category.base';
import Item from '../item/item.entity';
import ModifierGroup from '../modifierGroup/modifierGroup.entity';
import Order from '../order/order.entity';
import PriceBase from '../price/price.base';
import Purchase from '../purchase/purchase.entity';
import Store from '../store/store.entity';
import UomBase from '../uom/uom.base';
import LineItemBase from './lineItem.base';

@ObjectType()
@Entity()
export default class LineItem extends LineItemBase<LineItem> {
	
	@Field( () => Item, { nullable: true } )
	@ManyToOne( () => Item, { onDelete: 'set null', nullable: true } )
	item?: Item;
	
	@Field( () => UomBase, { nullable: true } )
	@ManyToOne( 'Uom', { onDelete: 'set null', nullable: true } )
	uom?: UomBase;
	
	@Field( () => CategoryBase, { nullable: true } )
	@ManyToOne( 'Category', { onDelete: 'set null', nullable: true } )
	category?: CategoryBase;
	
	@ManyToOne( () => Order, { onDelete: 'cascade', nullable: true } )
	order?: Order;
	
	@ManyToOne( () => Store, { onDelete: 'cascade', nullable: true } )
	store?: Store;
	
	@ManyToOne( () => Purchase, { onDelete: 'cascade', nullable: true } )
	purchase?: Purchase;
	
	@Field( () => [ ModifierGroup ] )
	@ManyToMany( () => ModifierGroup, undefined, {
		orderBy: { updatedAt: 'DESC' }
	} )
	modifierGroups? = new Collection<ModifierGroup>( this );
	
	@Field( () => [ PriceBase ] )
	@OneToMany( 'Price', 'lineItem', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	prices? = new Collection<PriceBase>( this );
	
}
