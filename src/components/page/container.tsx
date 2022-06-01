import { Container, ContainerProps } from '@mui/material';
import { useWideMedia } from '../../hooks/useWideMedia';
import ScrollTop from '../scrollTop';

export default function PageContainer( { children, sx, ...props }: ContainerProps ) {
	return (
		<Container
			disableGutters={!useWideMedia()}
			sx={{ overflowX: 'hidden', ...sx }}
			{...props}>
			<ScrollTop/>
			{children}
		</Container>
	);
}
