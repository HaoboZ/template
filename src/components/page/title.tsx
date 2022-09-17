import type { ListItemProps, ListItemTextProps } from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import type { ReactNode } from 'react';
import type { ActionProps } from '../actions';
import Actions from '../actions';

export type PageTitleProps = {
	actions?: ActionProps[] | ReactNode,
	max?: number,
	listItemProps?: ListItemProps<'div'>
} & ListItemTextProps;

export default function PageTitle( { actions, listItemProps, children, max, ...props }: PageTitleProps ) {
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
