import { IsDate, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class MessageValidator extends BaseValidator {
	
	@Field()
	@IsString()
	content: string;
	
	@Field( { nullable: true } )
	@IsDate()
	notified?: Date;
	
	@Field( { nullable: true } )
	@IsUrl()
	attachment?: string;
	
	@Field( () => ID )
	@IsUUID( 4 )
	room: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	user?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	client?: string;
	
}

@InputType()
export class MessagePartialValidator extends PartialType( MessageValidator ) {
}
