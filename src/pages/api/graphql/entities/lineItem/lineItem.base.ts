import { DoubleType, Property, SmallIntType, TextType } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import Base from '../base';

@ObjectType()
export default class LineItemBase<T = any> extends Base<T> {
	
	@Field( () => Int, { nullable: true } )
	@Property( { type: SmallIntType } )
	sequence?: number = 5;
	
	@Field()
	@Property( { type: DoubleType } )
	quantity: number;
	
	@Field()
	@Property()
	name: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	description?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	image?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	unit?: string;
	
	@Field()
	@Property( { type: DoubleType } )
	price: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	tax?: number;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	status?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	note?: string;
	
}
