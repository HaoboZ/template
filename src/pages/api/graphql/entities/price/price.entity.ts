import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import LineItem from '../lineItem/lineItem.entity';
import Order from '../order/order.entity';
import Purchase from '../purchase/purchase.entity';
import Store from '../store/store.entity';
import PriceBase from './price.base';

@ObjectType()
@Entity()
export default class Price extends PriceBase<Price> {
	
	@Field( () => Company, { nullable: true } )
	@ManyToOne( () => Company, { onDelete: 'cascade', nullable: true } )
	company?: Company;
	
	@ManyToOne( () => LineItem, { onDelete: 'cascade', nullable: true } )
	lineItem?: LineItem;
	
	@ManyToOne( () => Order, { onDelete: 'cascade', nullable: true } )
	order?: Order;
	
	@ManyToOne( () => Purchase, { onDelete: 'cascade', nullable: true } )
	purchase?: Purchase;
	
	@ManyToOne( () => Store, { onDelete: 'cascade', nullable: true } )
	store?: Store;
	
}
