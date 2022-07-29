import { RequestContext } from '@mikro-orm/core';
import { NextApiRequest, NextApiResponse } from 'next';

export type Context = RequestContext & { req: NextApiRequest, res: NextApiResponse };
