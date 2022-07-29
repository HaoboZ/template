import { Cascade, Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import AddressBase from '../address/address.base';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import Order from '../order/order.entity';
import ClientBase from './client.base';

@ObjectType()
@Entity()
export default class Client extends ClientBase<Client> {
	
	@Field( () => [ AddressBase ] )
	@OneToMany( 'Address', 'client', {
		orderBy      : { createdAt: 'DESC' } as any,
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	addresses? = new Collection<AddressBase>( this );
	
	@OneToMany( () => Order, 'client' )
	orders? = new Collection<Order>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
