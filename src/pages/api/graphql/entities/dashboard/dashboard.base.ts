import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class DashboardBase {
	
	@Field( { nullable: true } )
	unpaidSales?: number;
	
	@Field( { nullable: true } )
	paidSales?: number;
	
	@Field( { nullable: true } )
	pendingEstimatesTotal?: number;
	
	@Field( { nullable: true } )
	ordersCount?: number;
	
	constructor( values: Partial<DashboardBase> = {} ) {
		Object.assign( this, values );
	}
	
}
