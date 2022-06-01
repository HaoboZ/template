import { Typography } from '@mui/material';
import { NextPageContext } from 'next';

// noinspection JSUnusedGlobalSymbols
export default function Error( { statusCode } ) {
	return (
		<Typography variant='h1' textAlign='center' pt={10}>
			{statusCode
				? `Error ${statusCode}`
				: 'An unknown error has occurred'}
		</Typography>
	);
}

Error.getInitialProps = ( { res, err }: NextPageContext ) => ( {
	statusCode: res?.statusCode || err?.statusCode || 404
} );
