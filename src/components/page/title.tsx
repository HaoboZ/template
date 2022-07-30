import type { ListItemProps, ListItemTextProps } from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import type { ReactChild } from 'react';
import type { ActionProps } from '../actions';
import Actions from '../actions';

export default function PageTitle( { actions, listItemProps, children, max, ...props }: {
	actions?: ActionProps[] | ReactChild,
	max?: number,
	listItemProps?: ListItemProps<'div'>
} & ListItemTextProps ) {
	return (
		<ListItem component='div' {...listItemProps}>
			<ListItemText
				primaryTypographyProps={{ variant: 'h1' }}
				primary={children}
				secondaryTypographyProps={{ variant: 'subtitle1' }}
				{...props}
			/>
			{Array.isArray( actions ) ? <Actions items={actions} max={max}/> : actions}
		</ListItem>
	);
}
