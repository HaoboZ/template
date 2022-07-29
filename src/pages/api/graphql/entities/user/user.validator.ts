import { IsDate, IsEmail, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class UserValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsEmail()
	email?: string;
	
	@Field( { nullable: true } )
	@IsString()
	firstName?: string;
	
	@Field( { nullable: true } )
	@IsString()
	lastName?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	image?: string;
	
	@Field( { nullable: true } )
	@IsDate()
	lastLogin?: Date;
	
}

@InputType()
export class UserPartialValidator extends PartialType( UserValidator ) {
}
