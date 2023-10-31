import Providers from '@/src/providers';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import type { PackageJson } from 'type-fest';
import _packageJson from '../package.json';

const packageJson = _packageJson as PackageJson;

export const metadata: Metadata = {
	title: 'Template',
	description: packageJson.description,
	keywords: packageJson.keywords?.join(', '),
	authors: packageJson.author as any,
};

export const viewport: Viewport = {
	themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html suppressHydrationWarning lang='en'>
			<body>
				{process.env.NEXT_PUBLIC_VERCEL && <Analytics />}
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
