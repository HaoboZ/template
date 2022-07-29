import { IsArray, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType, Int } from 'type-graphql';
import { AddressPartialValidator } from '../address/address.validator';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class LocationValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( () => Int, { nullable: true } )
	@IsNumber()
	sequence?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	tax?: number;
	
	@Field( { nullable: true } )
	@IsString()
	timezone?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	policy?: string;
	
	@Field( () => AddressPartialValidator )
	@IsObject()
	address: AddressPartialValidator;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	staffs?: string[];
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class LocationPartialValidator extends PartialType( LocationValidator ) {
}
