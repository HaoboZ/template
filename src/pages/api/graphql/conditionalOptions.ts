import { AnyEntity, EntityRepository, FilterQuery, GetRepository } from '@mikro-orm/core';
import { set } from 'lodash-es';
import { Field, InputType, Int } from 'type-graphql';
import JsonScalar from './scalars/json.scalar';

@InputType()
export default class ConditionalOptions {
	@Field( () => Int, { nullable: true } )
	limit?: number;
	@Field( () => Int, { nullable: true } )
	offset?: number;
	@Field( () => [ String ], { nullable: true } )
	orderBy?: string[];
	@Field( () => JsonScalar, { nullable: true } )
	filter?: any;
}

export function find<T extends AnyEntity<T>, U extends EntityRepository<T> = EntityRepository<T>>(
	repository: GetRepository<T, U>,
	filter: FilterQuery<T>,
	options,
	other ) {
	return repository.find( filter, {
		limit  : options.limit,
		offset : options.offset,
		orderBy: options.orderBy?.map( ( orderBy ) => {
			const [ key, value ] = orderBy.split( ':' );
			return set( {}, key, value );
		} ),
		...other
	} );
}
