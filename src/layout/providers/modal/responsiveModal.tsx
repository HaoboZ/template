import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import type { DialogContentProps, DialogProps, SwipeableDrawerProps } from '@mui/material';
import {
	Button,
	Dialog,
	DialogActions,
	dialogClasses,
	DialogContent,
	DialogTitle,
	Grow,
	IconButton,
	SwipeableDrawer,
	Toolbar,
	Typography
} from '@mui/material';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import AsyncLoadingButton from '../../../components/asyncLoadingButton';
import useWideMedia from '../../../hooks/useWideMedia';
import { useModalControls } from './index';

export type ModalVariant = 'adaptive' | 'modal' | 'drawer';

export type ResponsiveModalProps = {
	open: boolean,
	onClose: ( event: {}, reason?: 'backdropClick' | 'escapeKeyDown' ) => void,
	// type of modal to be displayed
	variant?: ModalVariant,
	// only affects drawer variant
	bottom?: boolean
} & Partial<Omit<SwipeableDrawerProps & DialogProps, 'open' | 'onClose' | 'variant'>>;

export type ResponsiveModalContainerProps = {
	onClose?: () => void,
	// type of modal to be displayed
	variant?: ModalVariant,
	// only affects drawer variant
	bottom?: boolean,
	title?: ReactNode,
	// renders and called by save button if set
	onSave?: () => void,
	keepOpenOnSave?: boolean
} & Omit<DialogContentProps, 'title'>;

export default function ResponsiveModal( { variant = 'adaptive', bottom, ...props }: ResponsiveModalProps ) {
	const wide = useWideMedia();
	
	if ( variant === 'modal' || variant === 'adaptive' && wide ) {
		return (
			<Dialog
				fullWidth
				disablePortal
				closeAfterTransition
				maxWidth='md'
				TransitionComponent={Grow}
				sx={{
					[ `.${dialogClasses.paper}` ]: {
						ml: 'env(safe-area-inset-left)',
						mr: 'env(safe-area-inset-right)',
						mt: 'env(safe-area-inset-top)',
						mb: 'env(safe-area-inset-bottom)'
					}
				}}
				{...props}
			/>
		);
	} else {
		return (
			<SwipeableDrawer
				disableSwipeToOpen
				disablePortal
				closeAfterTransition
				anchor='bottom'
				sx={{ display: 'flex', justifyContent: 'center' }}
				PaperProps={{
					sx: {
						maxWidth            : '100%',
						maxHeight           : 'calc(100vh - env(safe-area-inset-top) - 32px)',
						height              : bottom ? 'auto' : '100%',
						left                : 'auto',
						right               : 'auto',
						borderTopLeftRadius : 12,
						borderTopRightRadius: 12,
						width               : ( { breakpoints } ) => breakpoints.values.md
					}
				}}
				onOpen={() => null}
				{...props}
			/>
		);
	}
}

export function ResponsiveModalContainer( {
	onClose,
	variant,
	title,
	onSave,
	keepOpenOnSave,
	...props
}: ResponsiveModalContainerProps ) {
	const wide = useWideMedia();
	const { closeModal, modalInfo } = useModalControls();
	
	variant = variant ?? modalInfo?.modalProps?.variant ?? 'adaptive';
	onClose = onClose ?? closeModal;
	
	if ( variant === 'modal' || variant === 'adaptive' && wide ) {
		return (
			<Fragment>
				{title && <DialogTitle>{title}</DialogTitle>}
				<DialogContent {...props}/>
				<DialogActions>
					{onSave ? (
						<AsyncLoadingButton
							variant='contained'
							onClick={async () => {
								await onSave();
								!keepOpenOnSave && onClose();
							}}>
							Save
						</AsyncLoadingButton>
					) : undefined}
					<Button variant='contained' color='error' onClick={onClose}>
						{onSave ? 'Cancel' : 'Close'}
					</Button>
				</DialogActions>
			</Fragment>
		);
	} else {
		return (
			<Fragment>
				<Toolbar>
					<IconButton edge='start' color='inherit' onClick={onClose}>
						<ArrowBackIcon/>
					</IconButton>
					<Typography variant='h3' flexGrow={1}>
						{title}
					</Typography>
					{onSave ? (
						<AsyncLoadingButton
							variant='contained'
							onClick={async () => {
								await onSave();
								!keepOpenOnSave && onClose();
							}}>
							Save
						</AsyncLoadingButton>
					) : undefined}
				</Toolbar>
				<DialogContent onTouchStart={( e ) => e.stopPropagation()} {...props}/>
			</Fragment>
		);
	}
}
