import type { TooltipProps, TypographyProps } from '@mui/material';
import { Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import useEventListener from '../hooks/useEventListener';

export default function OverflowTypography( { tooltipProps, ...props }: {
	tooltipProps?: TooltipProps
} & TypographyProps ) {
	const contentRef = useRef<HTMLElement>();
	
	const [ overFlowed, setOverFlowed ] = useState( false );
	
	useEventListener( window, 'resize', () => {
		if ( !contentRef.current ) return;
		setOverFlowed( contentRef.current.scrollWidth > contentRef.current.clientWidth );
	}, {
		callOnce    : true,
		dependencies: [ contentRef.current ]
	} );
	
	return (
		<Tooltip arrow title={props.children} disableHoverListener={!overFlowed} {...tooltipProps}>
			<Typography ref={contentRef} noWrap {...props}/>
		</Tooltip>
	);
}
