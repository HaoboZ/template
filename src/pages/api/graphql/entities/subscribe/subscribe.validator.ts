import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { SubscriptionStatus } from '../../enums/subscriptionStatus.enum';
import { SubscriptionType } from '../../enums/subscriptionType.enum';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class SubscribeValidator extends BaseValidator {
	
	@Field( () => SubscriptionType, { nullable: true } )
	@IsEnum( SubscriptionType )
	external?: SubscriptionType;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalKey?: string;
	
	@Field( () => SubscriptionStatus, { nullable: true } )
	@IsEnum( SubscriptionStatus )
	status?: SubscriptionStatus;
	
	@Field( { nullable: true } )
	@IsDate()
	endDate?: Date;
	
	@Field( () => ID )
	@IsUUID( 4 )
	tier: string;
	
}

@InputType()
export class SubscribePartialValidator extends PartialType( SubscribeValidator ) {
}
