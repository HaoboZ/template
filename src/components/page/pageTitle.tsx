import type { TypographyProps } from '@mui/material';
import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { ActionProps } from './pageActions';
import PageActions from './pageActions';

export type PageTitleProps = {
	actions?: ActionProps[] | ReactNode;
	max?: number;
} & TypographyProps;

export default function PageTitle({ actions, max, ...props }: PageTitleProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				px: { xs: 1, sm: 0 },
			}}>
			<Typography variant='h1' sx={{ py: 1 }} {...props} />
			{Array.isArray(actions) ? <PageActions items={actions} max={max} /> : actions}
		</Box>
	);
}
