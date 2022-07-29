import { IsArray, IsBoolean, IsEmail, IsObject, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import { AddressPartialValidator } from '../address/address.validator';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class ClientValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	name?: string;
	
	@Field()
	@IsString()
	contact: string;
	
	@Field( { nullable: true } )
	@IsEmail()
	email?: string;
	
	@Field( { nullable: true } )
	@IsString() // IsPhoneNumber()
	phone?: string;
	
	@Field( { nullable: true } )
	@IsString() // IsPhoneNumber()
	cell?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	logo?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	statement?: boolean;
	
	@Field( { nullable: true } )
	@IsString()
	code?: string;
	
	@Field( () => JsonScalar, { nullable: true } )
	@IsObject()
	metadata?: any;
	
	@Field( () => [ AddressPartialValidator ], { nullable: true } )
	@IsArray()
	addresses?: AddressPartialValidator[];
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class ClientPartialValidator extends PartialType( ClientValidator ) {
}
