import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import { ModifierPartialValidator } from '../modifier/modifier.validator';
import PartialType from '../partial.validator';

@InputType()
export default class ModifierGroupValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsNumber()
	min?: number;
	
	@Field( { nullable: true } )
	@IsNumber()
	max?: number;
	
	@Field( () => [ ModifierPartialValidator ], { nullable: true } )
	@IsArray()
	modifiers?: ModifierPartialValidator[];
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class ModifierGroupPartialValidator extends PartialType( ModifierGroupValidator ) {
}
