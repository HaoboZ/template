import { CircularProgress } from '@mui/material';
import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import type { ComponentType } from 'react';
import { createContext, Suspense, useContext, useState } from 'react';
import type { ResponsiveModalProps } from './responsiveModal';
import ResponsiveModal from './responsiveModal';

type ModalInfo<T> = {
	id: string,
	open: boolean,
	Component: ComponentType,
	modalProps?: Partial<ResponsiveModalProps>,
	props?: T
};

type C = {
	showModal: <T>(
		Component?: ComponentType<T>,
		modalProps?: Partial<ResponsiveModalProps> & { id?: string, props?: T }
	) => string,
	closeModal: ( id?: string ) => void,
	modalInfo: <T>( id: string ) => Promise<ModalInfo<T>>
};

const ModalContext = createContext<C>( {
	showModal : () => null,
	closeModal: () => null,
	modalInfo : null
} );
ModalContext.displayName = 'Modal';

export type ModalControls = {
	closeModal: ( ...args ) => void,
	events: EventEmitter
};

const ModalControlsContext = createContext<ModalControls & { modalInfo: ModalInfo<any> }>( {
	closeModal: () => null,
	modalInfo : null,
	events    : null
} );
ModalControlsContext.displayName = 'ModalControls';

export default function ModalProvider( { children } ) {
	const [ modals, setModals ] = useState<ModalInfo<any>[]>( [] );
	
	function controls( id: string ): ModalControls {
		return {
			closeModal: ( ...args ) => setModals( ( modals ) => {
				const index = modals.findIndex( ( modal ) => modal?.id === id );
				if ( index === -1 ) return modals;
				const newModals = [ ...modals ];
				newModals[ index ] = { ...newModals[ index ], open: false };
				newModals[ index ]?.props.controls.events.emit( 'close', ...args );
				setTimeout( () => setModals( ( modals ) => modals.filter( ( modal ) => modal?.id !== id ) ), 500 );
				return newModals;
			} ),
			events    : new EventEmitter()
		};
	}
	
	return (
		<ModalContext.Provider value={{
			showModal : ( Component, { id = nanoid(), props, ...modalProps } = {} ) => {
				setModals( ( modals ) => {
					const index = modals.findIndex( ( modal ) => modal?.id === id );
					const newModals = [ ...modals ];
					if ( index === -1 ) {
						newModals.push( {
							id,
							open : false,
							Component,
							modalProps,
							props: { ...props, controls: controls( id ) }
						} );
					} else {
						// found modal with same id
						newModals[ index ] = {
							...newModals[ index ],
							props: { ...newModals[ index ]?.props, ...props }
						};
						if ( newModals[ index ].open ) return newModals;
					}
					setTimeout( () => setModals( ( modals ) => {
						const index = modals.findIndex( ( modal ) => modal?.id === id );
						if ( index === -1 ) return modals;
						const newModals = [ ...modals ];
						newModals[ index ].props.controls.events.emit( 'open' );
						newModals[ index ] = { ...newModals[ index ], open: true };
						return newModals;
					} ), 0 );
					return newModals;
				} );
				return id;
			},
			closeModal: ( id ) => {
				if ( !id ) {
					modals.forEach( ( modal ) => modal?.props.controls.closeModal() );
					return;
				}
				const modal = modals.find( ( modal ) => modal?.id === id );
				modal?.props.controls.closeModal();
			},
			modalInfo : async ( id ) => await new Promise( ( resolve ) => setModals( ( modals ) => {
				const modal = modals.find( ( modal ) => modal?.id === id );
				resolve( modal );
				return modals;
			} ) )
		}}>
			{children}
			{modals.map( ( modal ) => {
				if ( !modal?.id ) return null;
				return (
					<ModalControlsContext.Provider key={modal.id} value={{ ...modal.props.controls, modalInfo: modal }}>
						<ResponsiveModal
							open={modal.open}
							{...modal.modalProps}
							onClose={async ( event, reason ) => {
								await modal.modalProps?.onClose?.( event, reason );
								modal.props.controls.closeModal();
							}}>
							<Suspense fallback={<CircularProgress/>}>
								<modal.Component {...modal.props}/>
							</Suspense>
						</ResponsiveModal>
					</ModalControlsContext.Provider>
				);
			} )}
		</ModalContext.Provider>
	);
}

export function useModal(): C {
	return useContext( ModalContext );
}

export function withModal( Component ) {
	return ( props ) => (
		<ModalContext.Consumer>
			{( modal ) => <Component modal={modal} {...props}/>}
		</ModalContext.Consumer>
	);
}

export function useModalControls() {
	return useContext( ModalControlsContext );
}
