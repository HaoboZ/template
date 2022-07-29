import { Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Item from '../item/item.entity';
import SimpleLineItem from '../lineItem/simpleLineItem';
import Menu from '../menu/menu.entity';
import UomBase from './uom.base';

@ObjectType()
@Entity()
export default class Uom extends UomBase<Uom> {
	
	@Field( () => Item )
	@ManyToOne( () => Item, { onDelete: 'cascade' } )
	item: Item;
	
	@ManyToMany( () => Menu, 'uoms' )
	menus? = new Collection<Menu>( this );
	
	@OneToMany( 'LineItem', 'uom' )
	lineItems? = new Collection<SimpleLineItem>( this );
	
}
