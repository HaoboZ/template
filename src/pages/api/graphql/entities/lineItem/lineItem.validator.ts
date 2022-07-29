import { IsArray, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType, Int } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';
import { PricePartialValidator } from '../price/price.validator';

@InputType()
export default class LineItemValidator extends BaseValidator {
	
	@Field( () => Int, { nullable: true } )
	@IsNumber()
	sequence?: number;
	
	@Field()
	@IsNumber()
	quantity: number;
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsString()
	description?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	image?: string;
	
	@Field( { nullable: true } )
	@IsString()
	unit?: string;
	
	@Field()
	@IsNumber()
	price?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	tax?: number;
	
	@Field( { nullable: true } )
	@IsString()
	status?: string;
	
	@Field( { nullable: true } )
	@IsString()
	note?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	item?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	uom?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	category?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	order?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	store?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	purchase?: string;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	modifierGroups?: string[];
	
	@Field( () => [ PricePartialValidator ], { nullable: true } )
	@IsArray()
	prices?: PricePartialValidator[];
	
}

@InputType()
export class LineItemPartialValidator extends PartialType( LineItemValidator ) {
}
