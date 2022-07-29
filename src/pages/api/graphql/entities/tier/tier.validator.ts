import { IsInt, IsNumber, IsString } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import JsonScalar from '../../scalars/json.scalar';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class TierValidator extends BaseValidator {
	
	@Field( () => Int )
	@IsInt()
	sequence: number;
	
	@Field()
	@IsString()
	name: string;
	
	@Field()
	@IsNumber()
	price: number;
	
	@Field( () => JsonScalar )
	externalIds: any;
	
	@Field()
	@IsString()
	description: string;
	
	@Field( () => JsonScalar )
	descriptions: any;
	
}

@InputType()
export class TierPartialValidator extends PartialType( TierValidator ) {
}
