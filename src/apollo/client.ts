import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { merge } from 'lodash-es';
import { useMemo } from 'react';

let apolloClient: ApolloClient<any>;

function createApolloClient() {
	return new ApolloClient( {
		ssrMode: typeof window === 'undefined',
		link   : new HttpLink( { uri: '/api/graphql' } ),
		cache  : new InMemoryCache()
	} );
}

export function initializeApollo( initialState = null ) {
	const _apolloClient = apolloClient ?? createApolloClient();
	
	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if ( initialState ) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = _apolloClient.extract();
		
		// Merge the existing cache into data passed from getStaticProps/getServerSideProps
		const data = merge( initialState, existingCache );
		
		// Restore the cache with the merged data
		_apolloClient.cache.restore( data );
	}
	// For SSG and SSR always create a new Apollo Client
	if ( typeof window === 'undefined' ) return _apolloClient;
	// Create the Apollo Client once in the client
	if ( !apolloClient ) apolloClient = _apolloClient;
	
	return _apolloClient;
}

export function useApollo( initialState? ) {
	return useMemo( () => initializeApollo( initialState ), [ initialState ] );
}
