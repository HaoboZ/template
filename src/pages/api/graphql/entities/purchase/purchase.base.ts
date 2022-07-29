import { ArrayType, DoubleType, Enum, IntegerType, JsonType, Property, TextType } from '@mikro-orm/core';
import { customAlphabet } from 'nanoid';
import { Field, Int, ObjectType } from 'type-graphql';
import { PurchaseStatus } from '../../enums/purchaseStatus.enum';
import JsonScalar from '../../scalars/json.scalar';
import SafeBase from '../safeBase';

const nanoid = customAlphabet( '23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8 );

@ObjectType()
export default class PurchaseBase<T = any> extends SafeBase<T> {
	
	static jsons = [ 'standingData' ];
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	number?: string = nanoid();
	
	@Field( () => PurchaseStatus )
	@Enum( { items: () => PurchaseStatus, type: 'string' } )
	status: PurchaseStatus = PurchaseStatus.DRAFT;
	
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
	serviceDate?: Date;
	
	@Field( () => [ String ] )
	@Property( { type: ArrayType } )
	attachments?: string[] = [];
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	dateSent?: Date;
	
	@Field()
	@Property( { type: DoubleType } )
	taxPercent?: number = 0;
	
	@Field()
	@Property( { type: DoubleType } )
	taxTotal?: number = 0;
	
	@Field()
	@Property( { type: DoubleType } )
	subTotal?: number = 0;
	
	@Field()
	@Property( { type: DoubleType } )
	grandTotal?: number = 0;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	cancelled?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	received?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	issues?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	confirmed?: boolean;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	declined?: boolean;
	
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
	noPrices?: boolean;
	
	@Field( () => JsonScalar )
	@Property( { type: JsonType, default: '{}' } )
	metadata?: any = {};
	
}
