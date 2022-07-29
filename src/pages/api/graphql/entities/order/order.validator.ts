import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { CommerceType } from '../../enums/commerceType.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import { LineItemPartialValidator } from '../lineItem/lineItem.validator';
import PartialType from '../partial.validator';
import { PaymentPartialValidator } from '../payment/payment.validator';
import { PricePartialValidator } from '../price/price.validator';

@InputType()
export default class OrderValidator extends BaseValidator {
	
	@Field( () => CommerceType, { nullable: true } )
	@IsEnum( CommerceType )
	type: CommerceType;
	
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
	@IsString( { message: 'testing po' } )
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
	
	@Field( { nullable: true } )
	@IsInt()
	standingDue?: number;
	
	@Field( () => JsonScalar, { nullable: true } )
	@IsObject()
	standingData?: any;
	
	@Field( { nullable: true } )
	@IsInt()
	duePeriod?: number;
	
	@Field( { nullable: true } )
		// @IsDate()
		standingDate?: Date;
	
	@Field( { nullable: true } )
	@IsDate()
	dueDate?: Date;
	
	@Field( { nullable: true } )
	@IsString()
	serviceType?: string;
	
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
	@IsNumber()
	overrideTotal?: number;
	
	@Field( { nullable: true } )
	@IsBoolean()
	cancelled?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	paid?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	paymentFailed?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	completed?: boolean;
	
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
	refunded?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	invoiced?: boolean;
	
	@Field( () => ID, { nullable: true } )
	@IsString()
	oldHash?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	client?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	companyLocation?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	clientAddress?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	shippingAddress?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	policy: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	staff?: string;
	
	// @Field( () => [ String ], { nullable: true } )
	// @IsArray()
	// lineItems?: string[];
	
	@Field( () => [ LineItemPartialValidator ], { nullable: true } )
	@IsArray()
	lineItems?: LineItemPartialValidator[];
	
	// @Field( () => [ String ], { nullable: true } )
	// @IsArray()
	// prices?: string[];
	
	@Field( () => [ PricePartialValidator ], { nullable: true } )
	@IsArray()
	prices?: PricePartialValidator[];
	
	@Field( () => [ PaymentPartialValidator ], { nullable: true } )
	@IsArray()
	payments?: PaymentPartialValidator[];
	
	@Field( () => JsonScalar, { nullable: true } )
	@IsObject()
	metadata?: any;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID()
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class OrderPartialValidator extends PartialType( OrderValidator ) {
}
