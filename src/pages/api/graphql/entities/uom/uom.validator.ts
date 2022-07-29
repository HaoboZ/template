import { IsArray, IsBoolean, IsInt, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class UomValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsNumber()
	price: number;
	
	@Field( { nullable: true } )
	@IsUrl()
	image?: string;
	
	@Field( { nullable: true } )
	@IsString()
	sku?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	selected?: boolean;
	
	@Field( { nullable: true } )
	@IsInt()
	sequence?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	cost?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	quantity?: number;
	
	@Field( { nullable: true } )
	@IsString()
	vendorSku?: string;
	
	@Field( () => ID )
	@IsUUID( 4 )
	item: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	menus?: string[];
	
}

@InputType()
export class UomPartialValidator extends PartialType( UomValidator ) {
}
