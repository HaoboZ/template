import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import AddressBase from '../address/address.base';
import CompanyWithGateway from '../company/companyWithGateway';
import GatewayBase from '../gateway/gateway.base';
import PolicyBase from '../policy/policy.base';
import StaffWithUser from '../staff/staffWithUser';
import LocationBase from './location.base';

@ObjectType()
@Entity()
export default class Location extends LocationBase<Location> {
	
	@Field( () => PolicyBase, { nullable: true } )
	@ManyToOne( 'Policy', { nullable: true, onDelete: 'set null' } )
	policy?: PolicyBase;
	
	@Field( () => AddressBase )
	@OneToOne( 'Address', undefined, { cascade: [ Cascade.ALL ], persist: true } )
	address: AddressBase;
	
	@Field( () => [ StaffWithUser ] )
	@ManyToMany( 'Staff', 'locations' )
	staffs? = new Collection<StaffWithUser>( this );
	
	@Field( () => CompanyWithGateway )
	@ManyToOne( 'Company', { onDelete: 'cascade' } )
	company: CompanyWithGateway;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
