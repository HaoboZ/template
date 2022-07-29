import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType, Int } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class CategoryValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsString()
	description?: string;
	
	@Field( () => Int, { nullable: true } )
	@IsNumber()
	sequence?: number;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	items?: string[];
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	locations?: string[];
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	gateway?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
}

@InputType()
export class CategoryPartialValidator extends PartialType( CategoryValidator ) {
}
