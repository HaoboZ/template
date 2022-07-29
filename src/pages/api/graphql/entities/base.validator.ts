import { IsDate, IsUUID } from 'class-validator';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default abstract class BaseValidator {
	
	@Field( () => ID, { nullable: true } )
	@IsUUID( 4 )
	id?: string;
	
	@Field( { nullable: true } )
	@IsDate()
	createdAt?: Date;
	
	@Field( { nullable: true } )
	@IsDate()
	updatedAt?: Date;
	
}
