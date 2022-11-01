import type { NextApiHandler } from 'next';
import helloWorld from '../../app/api/helloWorld';

const handler: NextApiHandler = async ( req, res ) => {
	res.send( await helloWorld() );
};
// noinspection JSUnusedGlobalSymbols
export default handler;
