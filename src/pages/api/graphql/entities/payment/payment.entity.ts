import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import ClientWithAddressGateway from '../client/clientWithAddressGateway';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import OrderBase from '../order/order.base';
import PaymentBase from './payment.base';

@ObjectType()
@Entity()
export default class Payment extends PaymentBase<Payment> {
	
	@Field( () => ClientWithAddressGateway, { nullable: true } )
	@ManyToOne( 'Client', { onDelete: 'set null', nullable: true } )
	client?: ClientWithAddressGateway;
	
	@Field( () => OrderBase, { nullable: true } )
	@ManyToOne( 'Order', { onDelete: 'cascade', nullable: true } )
	order?: OrderBase;
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
