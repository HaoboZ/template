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
		let href = '';
		const names = router.pathname.split( '/' );
		const paths = router.route.split( '/' );
		
		return paths.reduce<{ name: string, href: string }[]>( ( arr, path, index ) => {
			if ( index === paths.length - 1 ) return arr;
			if ( names[ index ] ) href += `/${names[ index ]}`;
			path = path.replace( /[\[\]]+/g, '' ) || 'home';
			if ( pathMap?.[ path ] !== undefined ) path = pathMap[ path ] as string;
			if ( path ) arr.push( { name: startCase( path ), href: href || '/' } );
			return arr;
		}, [] );
	}, [ router.asPath ] );
	console.log( routes );
	
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
