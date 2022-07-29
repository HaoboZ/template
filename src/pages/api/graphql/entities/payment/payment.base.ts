import { DoubleType, Enum, Property, TextType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { PaymentStatus } from '../../enums/paymentStatus.enum';
import Base from '../base';

@ObjectType()
export default class PaymentBase<T = any> extends Base<T> {
	
	@Field()
	@Property( { type: DoubleType } )
	amount: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	tip?: number;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	type?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	checkNumber?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	note?: string;
	
	@Field( () => PaymentStatus, { nullable: true } )
	@Enum( { items: () => PaymentStatus, type: 'string', nullable: true } )
	status?: PaymentStatus;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	refundedAmount?: number;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	signature?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalId?: string;
	
}
