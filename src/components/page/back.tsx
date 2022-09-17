import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Breadcrumbs, Button } from '@mui/material';
import { useRouter } from 'next/router';
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';
import startCase from '../../helpers/startCase';
import useWideMedia from '../../hooks/useWideMedia';
import PageLink, { PageLinkComponent } from './link';

export default function PageBack( { confirm: confirmBack, onClick, back }: {
	confirm?: boolean,
	onClick?: MouseEventHandler<HTMLButtonElement>,
	back?: boolean
} ) {
	const router = useRouter();
	const wide = useWideMedia();
	
	const routes = useMemo( () => {
		let href = '';
		const names = router.pathname.split( '/' );
		const paths = router.route.split( '/' );
		
		return paths.reduce<{ name: string, href: string }[]>( ( arr, path, index ) => {
			if ( !path || index === paths.length - 1 ) return arr;
			href += `/${names[ index ]}`;
			path = path.replace( /[\[\]]+/g, '' );
			arr.push( { name: startCase( path ), href } );
			return arr;
		}, [] );
	}, [ router.asPath ] );
	
	const clickListener = async ( e ) => {
		if ( confirmBack && !confirm( 'Are you sure you want to leave?' ) )
			throw 'cancel';
		
		await onClick?.( e );
		if ( back ) router.back();
	};
	
	if ( !back && wide ) {
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
		return (
			<Button
				component={PageLinkComponent}
				href={back ? undefined : path?.href}
				startIcon={<ArrowBackIcon/>}
				onClick={clickListener}>
				{back ? 'Back' : path?.name}
			</Button>
		);
	}
}
