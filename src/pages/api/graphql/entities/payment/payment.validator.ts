import { IsEnum, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { PaymentStatus } from '../../enums/paymentStatus.enum';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class PaymentValidator extends BaseValidator {
	
	@Field()
	@IsNumber()
	amount: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	tip: number;
	
	@Field( { nullable: true } )
	@IsString()
	type?: string;
	
	@Field( { nullable: true } )
	@IsString()
	checkNumber?: string;
	
	@Field( { nullable: true } )
	@IsString()
	note?: string;
	
	@Field( () => PaymentStatus, { nullable: true } )
	@IsEnum( PaymentStatus )
	status?: PaymentStatus;
	
	@Field( { nullable: true } )
	@IsNumber()
	refundedAmount?: number;
	
	@Field( { nullable: true } )
	@IsUrl()
	signature?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	client?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	order?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class PaymentPartialValidator extends PartialType( PaymentValidator ) {
}
