import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import SimpleLineItem from '../lineItem/simpleLineItem';
import Location from '../location/location.entity';
import PriceBase from '../price/price.base';
import StoreBase from './store.base';

@ObjectType()
@Entity()
export default class Store extends StoreBase<Store> {
	
	@Field( () => [ PriceBase ] )
	@OneToMany( 'Price', 'store', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	prices? = new Collection<PriceBase>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => [ Location ] )
	@ManyToMany( () => Location, undefined, {
		cascade : [ Cascade.ALL ],
		nullable: true
	} )
	locations = new Collection<Location>( this );
	
	@Field( () => [ SimpleLineItem ] )
	@OneToMany( 'LineItem', 'store', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true,
		orderBy      : { sequence: 'ASC' } as any
	} )
	lineItems? = new Collection<SimpleLineItem>( this );
	
}
