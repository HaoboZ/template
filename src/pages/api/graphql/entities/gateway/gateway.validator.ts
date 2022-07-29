import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { GatewayType } from '../../enums/gatewayType.enum';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class GatewayValidator extends BaseValidator {
	
	@Field( () => GatewayType )
	@IsEnum( GatewayType )
	external: GatewayType;
	
	@Field( { nullable: true } )
	@IsBoolean()
	active?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	default?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	permanent?: boolean;
	
	@Field( { nullable: true } )
	@IsString()
	externalId?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalKey?: string;
	
	@Field( { nullable: true } )
	@IsString()
	externalRefresh?: string;
}

@InputType()
export class GatewayPartialValidator extends PartialType( GatewayValidator ) {
}
