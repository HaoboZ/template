import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-micro';
import glob from 'fast-glob';
import 'reflect-metadata';
import { buildSchema, registerEnumType } from 'type-graphql';
import { runCors } from '../cors';
import authChecker from './authChecker';
import { ErrorInterceptor } from './error';

const ormPromise = ( async () => {
	try {
		const entityPaths = await glob( `${process.cwd()}/src/pages/api/graphql/**/*.entity.ts` );
		const entities: any = await Promise.all( entityPaths.map( ( resolverPath ) => import( `.${resolverPath.split( 'graphql' )[ 1 ]}` ) ) );
		
		return await MikroORM.init( {
			type    : process.env.MIKRO_ORM_TYPE as any,
			host    : process.env.MIKRO_ORM_HOST,
			port    : +process.env.MIKRO_ORM_PORT,
			user    : process.env.MIKRO_ORM_USER,
			password: process.env.MIKRO_ORM_PASSWORD,
			dbName  : process.env.MIKRO_ORM_DB_NAME,
			// migrations      : { path: process.env.MIKRO_ORM_MIGRATIONS_PATH },
			// seeder          : { path: process.env.MIKRO_ORM_SEEDER_PATH },
			forceUtcTimezone: true,
			entities        : entities.map( ( entity ) => entity.default )
		} );
		// const migrator = orm.getMigrator();
		// const migrations = await migrator.getPendingMigrations();
		// if ( migrations && migrations.length > 0 )
		// 	await migrator.up();
	} catch ( error ) {
		console.error( '📌 Could not connect to the database', error );
		throw Error( error );
	}
} )();

const apolloServerPromise = ( async () => {
	const enumPaths = await glob( `${process.cwd()}/src/pages/api/graphql/**/*.enum.ts` );
	for ( const enumPath of enumPaths ) {
		const enumObj = await import( `.${enumPath.split( 'graphql' )[ 1 ]}` );
		const name = Object.keys( enumObj )[ 0 ];
		registerEnumType( enumObj[ name ], { name } );
	}
	
	const resolverPaths = await glob( `${process.cwd()}/src/pages/api/graphql/**/*.resolver.ts` );
	const resolvers: any = await Promise.all( resolverPaths.map( ( resolverPath ) => import( `.${resolverPath.split( 'graphql' )[ 1 ]}` ) ) );
	
	const schema = await buildSchema( {
		resolvers        : resolvers.map( ( resolver ) => resolver.default ),
		authChecker,
		dateScalarMode   : 'isoDate',
		globalMiddlewares: [ ErrorInterceptor ]
	} );
	
	const orm = await ormPromise;
	const server = new ApolloServer( {
		schema,
		context: async ( { req, res } ) => {
			const em = orm.em.fork();
			req.headers._skip = true;
			return { req, res, em };
		},
		debug  : true
	} );
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
