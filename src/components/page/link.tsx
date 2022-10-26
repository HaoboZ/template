import type { LinkProps as MuiLinkProps, SxProps } from '@mui/material';
import { Link as MuiLink, styled } from '@mui/material';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';

const StyledNextLink = styled( NextLink )( {} );

export type PageLinkComponentProps =
	NextLinkProps
	& { sx?: SxProps }
	& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const PageLinkComponent = forwardRef<HTMLAnchorElement, PageLinkComponentProps>(
	function ( { onClick, ...props }, ref ) {
		return (
			<StyledNextLink
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
		);
	}
);

export type PageLinkProps = PageLinkComponentProps & Omit<MuiLinkProps, 'href'>;

const PageLink = forwardRef<HTMLAnchorElement, PageLinkProps>( function ( props, ref ) {
	return <MuiLink ref={ref} component={PageLinkComponent} {...props}/>;
} );
export default PageLink;
