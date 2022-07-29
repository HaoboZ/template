import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class AddressValidator extends BaseValidator {
	
	@Field()
	@IsString()
	line1: string;
	
	@Field( { nullable: true } )
	@IsString()
	line2?: string;
	
	@Field()
	@IsString()
	city: string;
	
	@Field()
	@IsString()
	state: string;
	
	@Field()
	@IsString()
	postalCode: string;
	
	@Field()
	@IsString()
	country: string;
	
	@Field( { nullable: true } )
	@IsNumber()
	lat?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	lng?: number;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	client?: string;
	
}

@InputType()
export class AddressPartialValidator extends PartialType( AddressValidator ) {
}
