import type { LinkProps as MuiLinkProps, SxProps } from '@mui/material';
import { Link as MuiLink, styled } from '@mui/material';
import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
import NextLink from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';

const Anchor = styled( 'a' )( {} );

export type PageLinkComponentProps =
	NextLinkProps
	& { sx?: SxProps }
	& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const PageLinkComponent = forwardRef<HTMLAnchorElement, PageLinkComponentProps>( function ( {
	href,
	as,
	replace,
	scroll,
	shallow,
	prefetch,
	locale,
	onClick,
	...props
}, ref ) {
	const isExternal = typeof href === 'string' && ( href.indexOf( 'http' ) === 0 || href.indexOf( 'mailto:' ) === 0 );
	
	if ( isExternal ) {
		return (
			<Anchor
				ref={ref}
				href={href}
				onClick={onClick ? async ( e ) => {
					try {
						await onClick( e );
					} catch {
						e.preventDefault();
					}
				} : undefined}
				{...props}
			/>
		);
	} else {
		return (
			<NextLink
				passHref
				href={href}
				prefetch={prefetch}
				as={as}
				replace={replace}
				scroll={scroll}
				shallow={shallow}
				locale={locale}>
				<Anchor
					ref={ref}
					onClick={onClick ? async ( e ) => {
						try {
							await onClick( e );
						} catch {
							e.preventDefault();
						}
					} : undefined}
					{...props}
				/>
			</NextLink>
		);
	}
} );

export type PageLinkProps = PageLinkComponentProps & Omit<MuiLinkProps, 'href'>;

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>( function ( props, ref ) {
	return <MuiLink ref={ref} component={PageLinkComponent} {...props}/>;
} );
export default PageLink;
