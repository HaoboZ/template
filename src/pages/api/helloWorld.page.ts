import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async ( req, res ) => {
	res.send( 'Hello World' );
};
// noinspection JSUnusedGlobalSymbols
export default handler;
