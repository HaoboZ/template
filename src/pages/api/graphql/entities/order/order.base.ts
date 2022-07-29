import { ArrayType, DoubleType, Enum, IntegerType, JsonType, Property, TextType } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { CommerceType } from '../../enums/commerceType.enum';
import { OrderStatus } from '../../enums/orderStatus.enum';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

@ObjectType()
export default class OrderBase<T = any> extends SafeBase<T> {
	
	static jsons = [ 'metadata', 'standingData' ];
	
	@Field( () => CommerceType )
	@Enum( { items: () => CommerceType, type: 'string' } )
	type: CommerceType = CommerceType.ORDER;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	number?: string;
	
	@Field( () => OrderStatus )
	@Enum( { items: () => OrderStatus, type: 'string' } )
	status: OrderStatus = OrderStatus.DRAFT;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	deliveryStatus?: string;
	
	@Field( { nullable: true } )
	@Property( { type: TextType, nullable: true } )
	notes?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	po?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	terms?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	standing?: boolean;
	
	@Field()
	@Property()
	standingActive?: boolean = false;
	
	@Field( () => Int, { nullable: true } )
	@Property( { type: IntegerType, nullable: true } )
	standingDue?: number;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType } )
	standingData?: any = {};
	
	@Field( () => Int, { nullable: true } )
	@Property( { type: IntegerType, nullable: true } )
	duePeriod?: number;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	standingDate?: Date;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	dueDate?: Date;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	serviceType?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	serviceDate?: Date;
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	attachments?: string[] = [];
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	dateSent?: Date;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType } )
	taxPercent?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType } )
	taxTotal?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType } )
	subTotal?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType } )
	grandTotal?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType, nullable: true } )
	overrideTotal?: number;
	
	@Field( { nullable: true } )
	@Property( { type: DoubleType } )
	paidTotal?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	cancelled?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	paid?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	paymentFailed?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	completed?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	viewed?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	sent?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	delivery?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	printed?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	refunded?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	invoiced?: boolean;
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	oldHash?: string;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
	@Field( { nullable: true } )
	@Property( { unique: true, nullable: true } )
	externalId?: string;
	
}
