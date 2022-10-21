import Head from 'next/head';
import type { ReactNode } from 'react';
import type { PageBackProps } from './back';
import PageBack from './back';
import PageContainer from './container';
import type { PageTitleProps } from './title';
import PageTitle from './title';

export default function Page( { title, titleBar, titleProps, hideBack, backProps, children }: {
	title?: string,
	titleBar?: string,
	titleProps?: PageTitleProps,
	hideBack?: boolean,
	backProps?: PageBackProps,
	children?: ReactNode
} ) {
	return (
		<PageContainer>
			<Head><title>{titleBar ?? title ? `${titleBar || title} | ` : ''}Template</title></Head>
			{!hideBack && <PageBack {...backProps}/>}
			<PageTitle {...titleProps}>{title}</PageTitle>
			{children}
		</PageContainer>
	);
}
