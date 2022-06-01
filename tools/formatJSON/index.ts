import * as fs from 'fs';
import { argv } from 'process';
import neatJSON from './neatJSON';

const file = fs.readFileSync( argv[ 2 ], { encoding: 'utf8' } ).toString();

fs.writeFileSync( argv[ 2 ], neatJSON( JSON.parse( file ), { aligned: true, wrap: true } ) );
