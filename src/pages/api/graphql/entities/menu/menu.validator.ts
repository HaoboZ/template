import { IsArray, IsBoolean, IsEmail, IsString, IsUrl } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';
import { UomPartialValidator } from '../uom/uom.validator';

@InputType()
export default class MenuValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	name?: string;
	
	@Field( () => [ String ], { nullable: true } )
	@IsArray()
	categories?: string[];
	
	@Field( { nullable: true } )
	@IsString()
	vendorName?: string;
	
	@Field( { nullable: true } )
	@IsString()
	vendorContact?: string;
	
	@Field( { nullable: true } )
	@IsString() // IsPhoneNumber()
	vendorPhone?: string;
	
	@Field( { nullable: true } )
	@IsEmail()
	vendorEmail?: string;
	
	@Field( { nullable: true } )
	@IsString()
	vendorLogo?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	vendorBanner?: string;
	
	@Field( { nullable: true } )
	@IsString()
	vendorDescription?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	vendorUrl?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	active?: boolean;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	servingLocations?: string[];
	
	@Field( () => [ UomPartialValidator ], { nullable: true } )
	@IsArray()
	uoms?: UomPartialValidator[];
	
	// @Field( () => ID )
	// @IsUUID( 4 )
	// location: string;
	
}

@InputType()
export class MenuPartialValidator extends PartialType( MenuValidator ) {
}
