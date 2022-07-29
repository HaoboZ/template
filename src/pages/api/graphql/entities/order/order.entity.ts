import { Cascade, Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import AddressBase from '../address/address.base';
import ClientWithAddressGateway from '../client/clientWithAddressGateway';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import SimpleLineItem from '../lineItem/simpleLineItem';
import Location from '../location/location.entity';
import Payment from '../payment/payment.entity';
import Policy from '../policy/policy.entity';
import PriceBase from '../price/price.base';
import Staff from '../staff/staff.entity';
import OrderBase from './order.base';

@ObjectType()
@Entity()
export default class Order extends OrderBase<Order> {
	
	@Field( () => ClientWithAddressGateway, { nullable: true } )
	@ManyToOne( 'Client', { nullable: true, onDelete: 'set null' } )
	client?: ClientWithAddressGateway;
	
	@Field( () => Location, { nullable: true } )
	@ManyToOne( () => Location, { nullable: true, onDelete: 'set null' } )
	companyLocation?: Location;
	
	@Field( () => AddressBase, { nullable: true } )
	@ManyToOne( 'Address', { nullable: true, onDelete: 'set null' } )
	clientAddress?: AddressBase;
	
	@Field( () => AddressBase, { nullable: true } )
	@ManyToOne( 'Address', { nullable: true, onDelete: 'set null' } )
	shippingAddress?: AddressBase;
	
	@Field( () => Policy, { nullable: true } )
	@ManyToOne( () => Policy, { nullable: true, onDelete: 'set null' } )
	policy: Policy;
	
	@Field( () => Staff, { nullable: true } )
	@ManyToOne( () => Staff, { nullable: true, onDelete: 'set null' } )
	staff?: Staff;
	
	@Field( () => [ SimpleLineItem ] )
	@OneToMany( 'LineItem', 'order', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true,
		orderBy      : { sequence: 'ASC' } as any
	} )
	lineItems? = new Collection<SimpleLineItem>( this );
	
	@Field( () => [ PriceBase ], { nullable: true } )
	@OneToMany( 'Price', 'order', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	prices? = new Collection<PriceBase>( this );
	
	@Field( () => [ Payment ] )
	@OneToMany( () => Payment, 'order', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	payments? = new Collection<Payment>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
