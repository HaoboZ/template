import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import BaseValidator from '../base.validator';
import PartialType from '../partial.validator';

@InputType()
export default class DemoValidator extends BaseValidator {
	
	@Field()
	@IsString()
	name: string;
	
}

@InputType()
export class DemoPartialValidator extends PartialType( DemoValidator ) {
}
