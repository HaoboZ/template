import { PubSubEngine } from 'graphql-subscriptions';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default class Notification {
	
	@Field( () => ID )
	id: string;
	
	@Field( { nullable: true } )
	message?: string;
	
	@Field( () => Date )
	date: Date;
	
}

export interface NotificationPayload {
	id: string,
	message: string
}

export async function sendNotification( pubSub: PubSubEngine, type: string, { id, message, company }: {
	id: string,
	message: string,
	company?
} ) {
	const payload = { id, message };
	await pubSub.publish( `${type}_${id}`, payload );
	if ( company ) await pubSub.publish( `${type}_${company}`, payload );
}
