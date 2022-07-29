import { Entity, ManyToOne } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';
import Client from '../client/client.entity';
import AddressBase from './address.base';

@ObjectType()
@Entity()
export default class Address extends AddressBase<Address> {
	
	@ManyToOne( () => Client, { nullable: true, onDelete: 'cascade' } )
	client?: Client;
	
}
