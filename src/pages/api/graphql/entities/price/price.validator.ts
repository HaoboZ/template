import { IsBoolean, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class PriceValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	isPercent?: boolean;
	
	@Field()
	@IsNumber()
	value: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	quantity?: number;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	company?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	lineItem?: string;
	
	@Field( () => JsonScalar, { nullable: true } )
	@IsObject()
	metadata?: any;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	order?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	purchase?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	store?: string;
	
}

@InputType()
export class PricePartialValidator extends PartialType( PriceValidator ) {
}
