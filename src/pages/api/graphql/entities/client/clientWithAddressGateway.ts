import { Collection } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import AddressBase from '../address/address.base';
import GatewayBase from '../gateway/gateway.base';
import ClientBase from './client.base';

@ObjectType()
export default class ClientWithAddressGateway extends ClientBase {
	
	@Field( () => [ AddressBase ] )
	addresses? = new Collection<AddressBase>( this );
	
	@Field( () => GatewayBase, { nullable: true } )
	gateway?: GatewayBase;
	
}
