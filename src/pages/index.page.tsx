import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Main() {
	const { data } = useQuery( [ 'helloWorld' ], async () => {
		const { data } = await axios.get( '/api/helloWorld' );
		return data;
	} );
	
	return <Typography>{data}</Typography>;
}
