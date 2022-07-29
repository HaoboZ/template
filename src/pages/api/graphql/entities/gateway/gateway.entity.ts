import { Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import Location from '../location/location.entity';
import GatewayBase from './gateway.base';

@ObjectType()
@Entity()
export default class Gateway extends GatewayBase<Gateway> {
	
	@Field( () => [ Location ] )
	@OneToMany( () => Location, 'gateway' )
	locations? = new Collection<Location>( this );
	
	@Field( () => Company, { nullable: true } )
	@ManyToOne( () => Company, { onDelete: 'cascade', nullable: true } )
	company: Company;
	
}
