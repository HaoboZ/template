import { EventEmitter } from 'events';
import { createContext, useContext, useState } from 'react';

const EventsContext = createContext<EventEmitter>( null );
EventsContext.displayName = 'Events';

export default function EventsProvider( { children } ) {
	const [ events ] = useState( () => new EventEmitter() );
	
	return <EventsContext.Provider value={events}>{children}</EventsContext.Provider>;
}

export function useEvents() {
	return useContext( EventsContext );
}

export function withEvents( Component ) {
	return ( props ) => (
		<EventsContext.Consumer>
			{( events ) => <Component events={events} {...props}/>}
		</EventsContext.Consumer>
	);
}
