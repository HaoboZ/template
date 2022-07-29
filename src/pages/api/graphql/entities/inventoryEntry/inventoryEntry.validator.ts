import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class InventoryEntryValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
	@Field()
	@IsNumber()
	price: number;
	
	@Field()
	@IsNumber()
	quantity: number;
	
	@Field()
	@IsString()
	sku: string;
	
	@Field( { nullable: true } )
	@IsString()
	vendorSku?: string;
	
	@Field( () => ID )
	@IsUUID( 4 )
	inventoryRun: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	user?: string;
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	uom?: string;
}

@InputType()
export class InventoryEntryPartialValidator extends PartialType( InventoryEntryValidator ) {
}
