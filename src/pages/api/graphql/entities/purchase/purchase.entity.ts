import { Cascade, Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import AddressBase from '../address/address.base';
import Company from '../company/company.entity';
import SimpleLineItem from '../lineItem/simpleLineItem';
import Location from '../location/location.entity';
import MenuBase from '../menu/menu.base';
import Staff from '../staff/staff.entity';
import PurchaseBase from './purchase.base';

@ObjectType()
@Entity()
export default class Purchase extends PurchaseBase<Purchase> {
	
	@Field( () => Location, { nullable: true } )
	@ManyToOne( () => Location, { nullable: true, onDelete: 'set null' } )
	companyLocation?: Location;
	
	@Field( () => AddressBase, { nullable: true } )
	@ManyToOne( 'Address', { nullable: true, onDelete: 'set null' } )
	vendorAddress?: AddressBase;
	
	@Field( () => AddressBase, { nullable: true } )
	@ManyToOne( 'Address', { nullable: true, onDelete: 'set null' } )
	shippingAddress?: AddressBase;
	
	@Field( () => MenuBase, { nullable: true } )
	@ManyToOne( 'Menu', { nullable: true, onDelete: 'set null' } )
	menu?: MenuBase;
	
	@Field( () => Staff, { nullable: true } )
	@ManyToOne( () => Staff, { nullable: true, onDelete: 'set null' } )
	staff?: Staff;
	
	@Field( () => [ SimpleLineItem ] )
	@OneToMany( 'LineItem', 'purchase', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true,
		orderBy      : { sequence: 'ASC' } as any
	} )
	lineItems? = new Collection<SimpleLineItem>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
}
