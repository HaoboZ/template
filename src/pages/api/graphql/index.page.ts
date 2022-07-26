import { ApolloServer } from 'apollo-server-micro';
import 'reflect-metadata';
import { runCors } from '../cors';
import loadSchema from './schema';

const apolloServerPromise = ( async () => {
	const schema = await loadSchema();
	const server = new ApolloServer( { schema } );
	await server.start();
	return server;
} )();

export const config = { api: { bodyParser: false } };

export default async function handler( req, res ) {
	await runCors( req, res );
	const apolloServer = await apolloServerPromise;
	const apolloHandler = apolloServer.createHandler( { path: '/api/graphql' } );
	await apolloHandler( req, res );
}
