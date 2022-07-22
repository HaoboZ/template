import { gql } from '@apollo/client';
import { Typography } from '@mui/material';
import { useApollo } from '../apollo/client';
import useAsyncEffect from '../hooks/useAsyncEffect';

export default function Main() {
	const apollo = useApollo();
	
	useAsyncEffect( async () => {
		const res = await apollo.query( {
			query: gql`
				query Query {
					recipes {
						title
						description
						ratings
						specification
					}
				}
			`
		} );
		console.log( res );
	}, [] );
	
	return <Typography>Hello World</Typography>;
}
