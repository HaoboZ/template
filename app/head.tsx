'use client';
import { useTheme } from '@mui/material';
import type { PackageJson } from 'type-fest';
import _packageJson from '../package.json';

const packageJson = _packageJson as PackageJson;

export default function Head() {
	const theme = useTheme();
	
	return (
		// eslint-disable-next-line @next/next/no-head-element
		<head>
			<title>Template</title>
			<meta charSet='utf-8'/>
			<meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'/>
			<meta key='theme' name='theme-color' content={theme.palette.primary.main}/>
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
		</head>
	);
}
