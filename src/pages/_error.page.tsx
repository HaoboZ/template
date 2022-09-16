import { Typography } from '@mui/material';
import type { NextPageContext } from 'next';

// noinspection JSUnusedGlobalSymbols
export default function Error( { statusCode, statusText }: { statusCode?: number | string, statusText?: string } ) {
	return (
		<Typography variant='h1' textAlign='center' pt={10}>
			{statusCode || statusText
				? `Error ${statusCode ? ` ${statusCode}` : ''}${statusText ? `: ${statusText}` : ''}`
				: 'An unknown error has occurred'}
		</Typography>
	);
}

Error.getInitialProps = ( { res, err }: NextPageContext ) => ( {
	statusCode: res?.statusCode || err?.statusCode || 404
} );
