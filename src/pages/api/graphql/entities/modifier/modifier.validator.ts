import { IsBoolean, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class ModifierValidator extends BaseValidator {
	
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
	
	@Field( { nullable: true } )
	@IsNumber()
	min?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	max?: number;
	
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
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	modifierGroup: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class ModifierPartialValidator extends PartialType( ModifierValidator ) {
}
