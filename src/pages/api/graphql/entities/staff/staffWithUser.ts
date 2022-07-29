import { Field, ObjectType } from 'type-graphql';
import UserBase from '../user/user.base';
import StaffBase from './staff.base';

@ObjectType()
export default class StaffWithUser extends StaffBase {
	
	@Field( () => UserBase, { nullable: true } )
	user?: UserBase;
	
}
