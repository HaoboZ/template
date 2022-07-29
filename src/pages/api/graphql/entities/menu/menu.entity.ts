import { Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import Item from '../item/item.entity';
import Location from '../location/location.entity';
import Purchase from '../purchase/purchase.entity';
import UomBase from '../uom/uom.base';
import MenuBase from './menu.base';

@ObjectType()
class MenuUom extends UomBase {
	
	@Field( () => Item )
	item: Item;
	
}

@ObjectType()
@Entity()
export default class Menu extends MenuBase<Menu> {
	
	@Field( () => [ Location ] )
	@ManyToMany( () => Location )
	servingLocations? = new Collection<Location>( this );
	
	@Field( () => [ MenuUom ] )
	@ManyToMany( 'Uom' )
	uoms? = new Collection<MenuUom>( this );
	
	@Field( () => [ Purchase ] )
	@OneToMany( () => Purchase, 'menu' )
	purchases? = new Collection<Purchase>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	// @Field( () => Location )
	// @ManyToOne( () => Location, { onDelete: 'cascade' } )
	// location: Location;
	
}
