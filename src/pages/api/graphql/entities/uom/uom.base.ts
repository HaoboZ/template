import { DoubleType, Property, SmallIntType, TextType } from '@mikro-orm/core';
import { customAlphabet } from 'nanoid';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import Base from '../base';

const nanoid = customAlphabet( '23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8 );

@ObjectType()
export default class UomBase<T = any> extends Base<T> {
	
	@Field()
	@Property()
	name: string;
	
	@Field()
	@Property( { type: DoubleType } )
	price: number;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	image?: string;
	
	@Field( () => ID, { nullable: true } )
	@Property( { nullable: true } )
	sku?: string = nanoid();
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	selected?: boolean;
	
	@Field( () => Int )
	@Property( { type: SmallIntType } )
	sequence?: number = 5;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	cost?: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	quantity?: number;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	vendorSku?: string;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
