import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import type { ButtonProps, MenuItemProps } from '@mui/material';
import { Button, ButtonGroup, MenuItem, MenuList } from '@mui/material';
import type { MouseEventHandler, ReactNode } from 'react';
import { useMemo } from 'react';
import ButtonMenu from './buttonMenu';

export type ActionProps = {
	name: ReactNode,
	onClick?: MouseEventHandler,
	buttonProps?: ButtonProps,
	menuItemProps?: MenuItemProps
};

export default function Actions( { items, max }: {
	items: ActionProps[],
	// max number of buttons displayed
	max?: number
} ) {
	const [ buttons, menu ] = useMemo( () => {
		const filtered = items.filter( Boolean );
		if ( !max || filtered.length <= max ) return [ filtered, [] ];
		
		const buttons = filtered.slice( 0, max );
		const menu = filtered.slice( max );
		return [ buttons, menu ];
	}, [ items, max ] );
	
	return (
		<ButtonGroup>
			{buttons.map( ( { name, onClick, buttonProps }, index ) => (
				<Button
					key={index}
					variant='outlined'
					onClick={onClick}
					{...buttonProps}>
					{name}
				</Button>
			) )}
			{Boolean( menu.length ) && (
				<ButtonMenu
					variant='outlined'
					renderMenu={( closeMenu ) => (
						<MenuList>
							{menu.map( ( { name, onClick, menuItemProps }, index ) => (
								<MenuItem
									key={index}
									onClick={( e ) => {
										onClick( e );
										closeMenu();
									}}
									{...menuItemProps}>
									{name}
								</MenuItem>
							) )}
						</MenuList>
					)}>
					<MoreHorizIcon/>
				</ButtonMenu>
			)}
		</ButtonGroup>
	);
}
