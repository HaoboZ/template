import { Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import GatewayBase from '../gateway/gateway.base';
import Location from '../location/location.entity';
import SubscribeWithTier from '../subscribe/subscribeWithTier';
import CompanyBase from './company.base';

@ObjectType()
@Entity()
export default class Company extends CompanyBase<Company> {
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	mainPayment?: GatewayBase;
	
	@Field( () => SubscribeWithTier, { nullable: true } )
	@OneToOne( 'Subscribe', 'company', { owner: true, nullable: true } )
	subscription?: SubscribeWithTier;
	
	@Field( () => [ Location ] )
	@OneToMany( () => Location, 'company', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	locations? = new Collection<Location>( this );
	
}
