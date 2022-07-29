import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class ReportBase {
	
	@Field( () => Date )
	date: Date;
	
	@Field( () => Number )
	grossSales: number;
	
	@Field( () => Number )
	amountCollected: number;
	
	@Field( () => Number )
	refunds: number;
	
	@Field( () => Number )
	unpaidBalance: number;
	
	@Field( () => Number )
	netSales: number;
	
	@Field( () => Number )
	taxesAndFees: number;
	
	constructor( values: Partial<ReportBase> = {} ) {
		Object.assign( this, values );
	}
	
}
