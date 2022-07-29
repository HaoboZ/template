import { IsArray, IsEmail, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { Permissions } from '../../enums/permissions.enum';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class StaffValidator extends BaseValidator {
	
	@Field( () => [ Permissions ], { nullable: true } )
	@IsArray()
	permissions?: Permissions[];
	
	@Field()
	@IsEmail()
	email: string;
	
	@Field( { nullable: true } )
	@IsString()
	code?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	user?: string;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	locations?: string[];
	
}

@InputType()
export class StaffPartialValidator extends PartialType( StaffValidator ) {
}
