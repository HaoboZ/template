import { MikroORM } from '@mikro-orm/core';
import { PubSubEngine } from 'graphql-subscriptions';
import { Arg, Authorized, Ctx, Mutation, PubSub, Query, Resolver, Root, Subscription } from 'type-graphql';
import { TestSeeder } from '../seeders/TestSeeder';
import { TierSeeder } from '../seeders/TierSeeder';
import Notification, { NotificationPayload } from './notification.type';

@Resolver()
export class GlobalResolver {
	
	@Query( () => Date )
	currentDate() {
		return new Date();
	}
	
	@Mutation( () => Boolean )
	@Authorized( 'SU' )
	async resetDatabase( @Ctx() { orm }: { orm: MikroORM } ) {
		await orm.getSchemaGenerator().dropSchema();
		const migrator = orm.getMigrator();
		const migrations = await migrator.getPendingMigrations();
		if ( migrations && migrations.length > 0 )
			await migrator.up();
		
		await orm.getSchemaGenerator().updateSchema();
		await orm.getSeeder().seed( TierSeeder, TestSeeder );
		
		return true;
	}
	
	@Query( () => String )
	async version() {
		return '2.0.0';
	}
	
	@Query( () => Boolean )
	async trigger(
		@Arg( 'topic' ) topic: string,
		@Arg( 'id' ) id: string,
		@PubSub() pubSub: PubSubEngine
	) {
		await pubSub.publish( `${topic}_${id}`, { id } );
		return true;
	}
	
	@Subscription( () => Notification, {
		topics: ( { args, context } ) => {
			if ( process.env.NODE_ENV === 'development' )
				console.log( `listen: ${args.topic}_${args.id}` );
			return args.id
				? `${args.topic}_${args.id === 'COMPANY' ? context.company : args.id}`
				: args.topic;
		}
	} )
	modified(
		@Arg( 'topic' ) topic: string,
		@Arg( 'id' ) id: string,
		@Root() notificationPayload: NotificationPayload
	) {
		return { ...notificationPayload, date: new Date() };
	}
}
