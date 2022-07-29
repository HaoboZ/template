import { IsArray, IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { StoreType } from '../../enums/storeType.enum';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import { LineItemPartialValidator } from '../lineItem/lineItem.validator';
import PartialType from '../partial.validator';
import { PricePartialValidator } from '../price/price.validator';

@InputType()
export default class StoreValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	banner?: string;
	
	@Field( { nullable: true } )
	@IsString()
	description?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	active?: boolean;
	
	@Field( { nullable: true } )
	@IsNumber()
	minDelivery?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	taxPercent?: number;
	
	@Field( () => [ PricePartialValidator ], { nullable: true } )
	@IsArray()
	prices?: PricePartialValidator[];
	
	@Field( () => [ StoreType ], { nullable: true } )
	@IsArray()
	type?: StoreType[];
	
	@Field( () => [ String ], { nullable: true } )
	@IsArray()
	city?: string[];
	
	@Field( () => [ String ], { nullable: true } )
	@IsArray()
	country?: string[];
	
	@Field( () => [ String ], { nullable: true } )
	@IsArray()
	zipCode?: string[];
	
	@Field( () => [ ID ] )
	@IsArray()
	locations?: string[];
	
	@Field( () => [ LineItemPartialValidator ], { nullable: true } )
	@IsArray()
	lineItems?: LineItemPartialValidator[];
	
	@Field( () => JsonScalar, { nullable: true } )
	hours?: any;
	
	@Field( () => JsonScalar, { nullable: true } )
	metadata?: any;
	
	@Field( () => JsonScalar, { nullable: true } )
	rewards?: any;
	
}

@InputType()
export class StorePartialValidator extends PartialType( StoreValidator ) {
}
