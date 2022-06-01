import { Box, ListItem, ListItemProps, ListItemText, ListItemTextProps } from '@mui/material';
import { ReactChild } from 'react';
import Actions, { ActionProps } from '../actions';

export default function PageSection( { actions, listItemProps, children, max, ...props }: {
	actions?: ActionProps[] | ReactChild,
	max?: number,
	listItemProps?: ListItemProps<'div'>
} & ListItemTextProps ) {
	return (
		<Box display='flex' flexDirection='column'>
			<ListItem divider component='div' sx={{ my: 2 }} {...listItemProps}>
				<ListItemText primaryTypographyProps={{ variant: 'h3' }} {...props}/>
				{Array.isArray( actions ) ? <Actions items={actions} max={max}/> : actions}
			</ListItem>
			{children}
		</Box>
	);
}
