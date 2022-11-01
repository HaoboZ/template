import { Roboto } from '@next/font/google';
import type { ReactNode } from 'react';
import Providers from '../src/layout/providers';
import '../src/layout/style.scss';

const roboto = Roboto( {
	weight: [ '300', '400', '500', '700' ]
} );

export default function RootLayout( { children }: { children: ReactNode } ) {
	return (
		<html lang='en' className={roboto.className}>
			<body>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
