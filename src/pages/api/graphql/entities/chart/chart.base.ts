import { ArrayType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Order from '../order/order.entity';
import Purchase from '../purchase/purchase.entity';

@ObjectType()
export default class ChartBase {
	
	@Field( () => [ Order ] )
	@Property( { type: ArrayType } )
	paidOrders?: Order[];
	
	@Field( () => [ Order ] )
	@Property( { type: ArrayType } )
	paidInvoices?: Order[];
	
	@Field( () => [ Purchase ] )
	@Property( { type: ArrayType } )
	purchases?: Purchase[];
	
	constructor( values: Partial<ChartBase> = {} ) {
		Object.assign( this, values );
	}
	
}
