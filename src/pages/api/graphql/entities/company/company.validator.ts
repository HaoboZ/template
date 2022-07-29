import { IsEmail, IsEnum, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { CompanySource } from '../../enums/companySource.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class CompanyValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsString()
	contact?: string;
	
	@Field()
	@IsEmail()
	email: string;
	
	@Field( { nullable: true } )
	@IsString() // IsPhoneNumber()
	phone?: string;
	
	@Field( { nullable: true } )
	@IsString()
	description?: string;
	
	@Field( () => CompanySource, { nullable: true } )
	@IsEnum( CompanySource )
	source?: CompanySource;
	
	@Field( { nullable: true } )
	@IsUrl()
	logo?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	banner?: string;
	
	@Field( { nullable: true } )
	@IsString()
	subdomain?: string;
	
	@Field( { nullable: true } )
	@IsString()
	website?: string;
	
	@Field( () => JsonScalar, { nullable: true } )
	metadata?: any;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	mainPayment?: string;
	
}

@InputType()
export class CompanyPartialValidator extends PartialType( CompanyValidator ) {
}
