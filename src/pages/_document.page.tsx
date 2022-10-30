import { Head, Html, Main, NextScript } from 'next/document';
import type { PackageJson } from 'type-fest';
import _packageJson from '../../package.json';

const packageJson = _packageJson as PackageJson;

// noinspection JSUnusedGlobalSymbols
export default function _Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta charSet='utf-8'/>
				{/*seo*/}
				{'description' in packageJson && <meta name='description' content={packageJson.description}/>}
				{'keywords' in packageJson && <meta name='keywords' content={packageJson.keywords.join( ', ' )}/>}
				{'author' in packageJson && <meta name='author' content={packageJson.author as string}/>}
				{/*pwa*/}
				<meta name='mobile-web-app-capable' content='yes'/>
				<link rel='manifest' href='/app.webmanifest'/>
				<link rel='shortcut icon' href='/favicon.ico'/>
				{/*ios*/}
				<meta name='apple-mobile-web-app-capable' content='yes'/>
				<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
				{/*font*/}
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
				/>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/icon?family=Material+Icons'
				/>
			</Head>
			<body>
				<Main/>
				<NextScript/>
			</body>
		</Html>
	);
}
