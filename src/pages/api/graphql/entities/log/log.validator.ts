import { IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class LogValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	table?: string;
	
	@Field( { nullable: true } )
	@IsUUID()
	documentId?: string;
	
	@Field( { nullable: true } )
	@IsString()
	name?: string;
	
	@Field( { nullable: true } )
	@IsString()
	text?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	company?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	user?: string;
	
}

@InputType()
export class LogPartialValidator extends PartialType( LogValidator ) {
}
