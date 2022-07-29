import { Field, ObjectType } from 'type-graphql';
import JsonScalar from '../scalars/json.scalar';

@ObjectType()
export default class Repeating {
	
	@Field( { nullable: true } )
	startDate?: Date;
	
	@Field( { nullable: true } )
	type?: 'NONE' | 'WEEK' | 'MONTH' | 'YEAR';
	
	@Field( { nullable: true } )
	multiple?: number;
	
	// day of the week
	@Field( () => JsonScalar, { nullable: true } )
	repeat?: { [ day: string ]: boolean };
	
	@Field( { nullable: true } )
	ends?: 'NEVER' | 'DATE' | 'OCCURRENCES';
	
	@Field( { nullable: true } )
	endDate?: Date;
	
	@Field( { nullable: true } )
	occurrences?: number;
	
	@Field( () => [ Date ], { nullable: true } )
	include?: Date[];
	
	@Field( () => [ Date ], { nullable: true } )
	exclude?: Date[];
	
}
