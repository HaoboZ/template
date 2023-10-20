'use client';
import { Container } from '@mui/joy';
import type { ReactNode } from 'react';
import type { PageBackProps } from './back';
import PageBack from './back';
import type { PageTitleProps } from './title';
import PageTitle from './title';

export default function Page({
	title,
	titleProps,
	hideBack,
	backProps,
	children,
}: {
	title?: ReactNode;
	titleProps?: PageTitleProps;
	hideBack?: boolean;
	backProps?: PageBackProps;
	children?: ReactNode;
}) {
	return (
		<Container>
			{!hideBack && <PageBack {...backProps} />}
			{title && <PageTitle {...titleProps}>{title}</PageTitle>}
			{children}
		</Container>
	);
}
