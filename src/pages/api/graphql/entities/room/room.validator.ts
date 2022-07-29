import { IsArray, IsBoolean, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class RoomValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	name?: string;
	
	@Field( { nullable: true } )
	@IsString()
	linkedId?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	visible?: boolean;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	user?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	client?: string;
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	users?: string[];
	
	@Field( () => JsonScalar, { nullable: true } )
	unreadMessagesCount?: any;
	
}

@InputType()
export class RoomPartialValidator extends PartialType( RoomValidator ) {
}
