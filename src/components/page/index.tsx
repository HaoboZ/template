import Head from 'next/head';
import { ReactNode } from 'react';
import PageBack from './back';
import PageContainer from './container';
import PageTitle from './title';

export default function Page( { title, children }: {
	title?: string,
	children?: ReactNode
} ) {
	return (
		<PageContainer>
			<Head><title>{title} | Template</title></Head>
			<PageBack/>
			<PageTitle>{title}</PageTitle>
			{children}
		</PageContainer>
	);
}
