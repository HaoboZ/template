import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class PolicyValidator extends BaseValidator {
	
	@Field()
	@IsString()
	policy: string;
	
}

@InputType()
export class PolicyPartialValidator extends PartialType( PolicyValidator ) {
}
