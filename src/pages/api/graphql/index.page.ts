import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-micro';
import 'reflect-metadata';
import { buildSchema, registerEnumType } from 'type-graphql';
import { runCors } from '../cors';
import authChecker from './authChecker';
import { entities } from './entities/entities';
import { resolvers } from './entities/resolvers';
import { enums } from './enums/enums';
import { ErrorInterceptor } from './error';

const ormPromise = ( async () => {
	try {
		if ( global.orm ) return global.orm;
		
		global.orm = await MikroORM.init( {
			type    : process.env.MIKRO_ORM_TYPE as any,
			host    : process.env.MIKRO_ORM_HOST,
			port    : +process.env.MIKRO_ORM_PORT,
			user    : process.env.MIKRO_ORM_USER,
			password: process.env.MIKRO_ORM_PASSWORD,
			dbName  : process.env.MIKRO_ORM_DB_NAME,
			// migrations      : { path: process.env.MIKRO_ORM_MIGRATIONS_PATH },
			// seeder          : { path: process.env.MIKRO_ORM_SEEDER_PATH },
			forceUtcTimezone: true,
			entities
		} );
		// const migrator = orm.getMigrator();
		// const migrations = await migrator.getPendingMigrations();
		// if ( migrations && migrations.length > 0 )
		// 	await migrator.up();
		return global.orm;
	} catch ( error ) {
		console.error( '📌 Could not connect to the database', error );
		throw Error( error );
	}
} )();

const apolloServerPromise = ( async () => {
	if ( global.server ) return global.server;
	
	for ( const [ name, enumObj ] of Object.entries( enums ) ) {
		registerEnumType( enumObj, { name } );
	}
	
	const schema = await buildSchema( {
		resolvers        : resolvers as any,
		authChecker,
		dateScalarMode   : 'isoDate',
		globalMiddlewares: [ ErrorInterceptor ]
	} );
	
	const orm = await ormPromise;
	const server = new ApolloServer( {
		schema,
		context      : async ( { req, res } ) => {
			const em = orm.em.fork();
			req.headers._skip = true;
			return { req, res, em };
		},
		introspection: true
	} );
	await server.start();
	global.server = server;
	return global.server;
} )();

export const config = { api: { bodyParser: false } };

export default async function handler( req, res ) {
	await runCors( req, res );
	const apolloServer = await apolloServerPromise;
	const apolloHandler = apolloServer.createHandler( { path: '/api/graphql' } );
	await apolloHandler( req, res );
}
