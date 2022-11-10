import helloWorld from '@/app/api/helloWorld';
import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async ( req, res ) => {
	res.send( await helloWorld() );
};
// noinspection JSUnusedGlobalSymbols
export default handler;
