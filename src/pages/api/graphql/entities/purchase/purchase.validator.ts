import { IsArray, IsBoolean, IsDate, IsInt, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType, Int } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import { LineItemPartialValidator } from '../lineItem/lineItem.validator';
import PartialType from '../partial.validator';

@InputType()
export default class PurchaseValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	number?: string;
	
	@Field( { nullable: true } )
	@IsString()
	deliveryStatus?: string;
	
	@Field( { nullable: true } )
	@IsString()
	notes?: string;
	
	@Field( { nullable: true } )
	@IsString()
	po?: string;
	
	@Field( { nullable: true } )
	@IsString()
	terms?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	standing?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	standingActive?: boolean;
	
	@Field( () => Int, { nullable: true } )
	@IsInt()
	grandTotal?: number;
	
	@Field( () => Int, { nullable: true } )
	@IsInt()
	standingDue?: number;
	
	@Field( () => JsonScalar, { nullable: true } )
	standingData?: any;
	
	@Field( () => Int, { nullable: true } )
	@IsInt()
	duePeriod?: number;
	
	@Field( { nullable: true } )
	@IsDate()
	standingDate?: Date;
	
	@Field( { nullable: true } )
	@IsDate()
	dueDate?: Date;
	
	@Field( { nullable: true } )
	@IsDate()
	serviceDate?: Date;
	
	@Field( () => [ String ], { nullable: true } )
	@IsArray()
	attachments?: string[];
	
	@Field( { nullable: true } )
	@IsDate()
	dateSent?: Date;
	
	@Field( { nullable: true } )
	@IsNumber()
	taxPercent?: number;
	
	@Field( { nullable: true } )
	@IsBoolean()
	cancelled?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	received?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	issues?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	confirmed?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	declined?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	viewed?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	sent?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	delivery?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	printed?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	noPrices?: boolean;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	companyLocation?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	vendorAddress?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	shippingAddress?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	menu?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	staff?: string;
	
	@Field( () => [ LineItemPartialValidator ], { nullable: true } )
	@IsArray()
	lineItems?: LineItemPartialValidator[];
	
	@Field( () => JsonScalar, { nullable: true } )
	@IsObject()
	metadata?: any;
	
}

@InputType()
export class PurchasePartialValidator extends PartialType( PurchaseValidator ) {
}
