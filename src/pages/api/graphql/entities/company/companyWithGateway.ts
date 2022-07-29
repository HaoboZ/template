import { Field, ObjectType } from 'type-graphql';
import GatewayBase from '../gateway/gateway.base';
import CompanyBase from './company.base';

@ObjectType()
export default class CompanyWithGateway extends CompanyBase {
	
	@Field( () => GatewayBase, { nullable: true } )
	mainPayment?: GatewayBase;
	
}
