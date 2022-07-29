import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import { InventoryEntryPartialValidator } from '../inventoryEntry/inventoryEntry.validator';
import PartialType from '../partial.validator';

@InputType()
export default class InventoryRunValidator extends BaseValidator {
	
	@Field( { nullable: true } )
	@IsString()
	number?: string;
	
	@Field( { nullable: true } )
	@IsDate()
	end?: Date;
	
	@Field( () => [ InventoryEntryPartialValidator ], { nullable: true } )
	@IsArray()
	inventoryEntries?: InventoryEntryPartialValidator[];
	
	@Field( () => [ ID ], { nullable: true } )
	@IsArray()
	users?: string[];
	
	@Field( () => ID )
	@IsUUID( 4 )
	location: string;
	
}

@InputType()
export class InventoryRunPartialValidator extends PartialType( InventoryRunValidator ) {
}
