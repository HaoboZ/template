import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Breadcrumbs, Button } from '@mui/material';
import { startCase } from 'lodash-es';
import { useRouter } from 'next/router';
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';
import useWideMedia from '../../hooks/useWideMedia';
import PageLink, { PageLinkComponent } from './link';

export type PageBackProps = {
	confirm?: boolean,
	onClick?: MouseEventHandler<HTMLButtonElement>,
	pathMap?: Record<string, boolean | string>,
	backButton?: boolean
};

export default function PageBack( { confirm: confirmBack, onClick, pathMap, backButton }: PageBackProps ) {
	const router = useRouter();
	const wide = useWideMedia();
	
	const routes = useMemo( () => {
		if ( router.pathname === '/' ) return [];
		
		let href = '';
		const paths = router.asPath.split( '/' );
		const names = router.route.split( '/' );
		
		return names.reduce<{ name: string, href: string }[]>( ( arr, name, index ) => {
			if ( index === names.length - 1 ) return arr;
			if ( paths[ index ] ) href += `/${paths[ index ]}`;
			name = name.replace( /[\[\]]+/g, '' ) || 'home';
			if ( pathMap?.[ name ] !== undefined ) name = pathMap[ name ] as string;
			if ( name ) arr.push( { name: startCase( name ), href: href || '/' } );
			return arr;
		}, [] );
	}, [ router.asPath ] );
	
	const clickListener = async ( e ) => {
		if ( confirmBack && !confirm( 'Are you sure you want to leave?' ) )
			throw 'cancel';
		
		await onClick?.( e );
		if ( backButton ) router.back();
	};
	
	if ( !backButton && wide ) {
		return (
			<Breadcrumbs sx={{ pt: 1 }}>
				<div/>
				{routes.map( ( { href, name }, index ) => (
					<PageLink
						key={index}
						underline='none'
						color='primary'
						href={href}
						onClick={clickListener}>
						{name}
					</PageLink>
				) )}
			</Breadcrumbs>
		);
	} else {
		const path = routes.at( -1 );
		if ( !path ) return null;
		
		return (
			<Button
				component={backButton ? undefined : PageLinkComponent}
				href={backButton ? undefined : path.href}
				startIcon={<ArrowBackIcon/>}
				onClick={clickListener}>
				{backButton ? 'Back' : path.name}
			</Button>
		);
	}
}
