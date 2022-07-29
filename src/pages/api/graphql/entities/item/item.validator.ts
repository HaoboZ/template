import { IsArray, IsBoolean, IsEnum, IsString, IsUrl, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import { InventoryType } from '../../enums/inventoryType.enum';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';
import { UomPartialValidator } from '../uom/uom.validator';

@InputType()
export default class ItemValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field( { nullable: true } )
	@IsString()
	description?: string;
	
	@Field( { nullable: true } )
	@IsUrl()
	image?: string;
	
	@Field( { nullable: true } )
	@IsBoolean()
	taxable?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	isInventory?: boolean;
	
	@Field( { nullable: true } )
	@IsBoolean()
	isHidden?: boolean;
	
	@Field( () => InventoryType, { nullable: true } )
	@IsEnum( InventoryType )
	type?: InventoryType;
	
	@Field( () => [ UomPartialValidator ], { nullable: true } )
	@IsArray()
	uoms?: UomPartialValidator[];
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	categories?: string[];
	
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
export class ItemPartialValidator extends PartialType( ItemValidator ) {
}
