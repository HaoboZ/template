import { AuthChecker } from 'type-graphql';
import { Context } from './context';

const authChecker: AuthChecker<Context> = async ( { context }, roles ) => {
	return true;
	if ( context.token?.uid === process.env.SECRET ) return true;
	return Boolean( context.staff?.permissions
		.find( ( permissions ) => roles.includes( permissions ) ) );
};
export default authChecker;
