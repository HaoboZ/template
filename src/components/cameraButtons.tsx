import { Photo as PhotoIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { Backdrop, Box, IconButton } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useId, useRef, useState } from 'react';

export default function CameraButtons( { onRead }: { onRead: ( text: string ) => void } ) {
	const { enqueueSnackbar } = useSnackbar();
	
	const [ html5QrCode, setHtml5QrCode ] = useState<Html5Qrcode>();
	const [ text, setText ] = useState<string>();
	const [ isScanning, setIsScanning ] = useState( false );
	
	const id = useId();
	const inputRef = useRef<HTMLInputElement>();
	
	useEffect( () => {
		setHtml5QrCode( new Html5Qrcode( id ) );
	}, [] );
	
	useEffect( () => {
		setText( undefined );
		if ( !text ) return;
		onRead( text );
	}, [ text ] );
	
	return (
		<Fragment>
			<Backdrop
				open={isScanning}
				onClick={async ( e ) => {
					e.stopPropagation();
					setIsScanning( false );
					await html5QrCode.stop();
				}}>
				<Box id={id}/>
			</Backdrop>
			<IconButton
				onClick={async () => {
					if ( !html5QrCode || isScanning ) return;
					setIsScanning( true );
					try {
						await html5QrCode.start( { facingMode: 'environment' }, {
							fps  : 10,
							qrbox: 250
						}, async ( decodedText ) => {
							setText( decodedText );
							await html5QrCode.stop();
							setIsScanning( false );
						}, undefined );
					} catch ( e ) {
						setIsScanning( false );
						enqueueSnackbar( e?.response?.data || e?.message || e, { variant: 'error' } );
					}
				}}>
				<PhotoCameraIcon/>
			</IconButton>
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				style={{ display: 'none' }}
				onChange={async ( e ) => {
					if ( !e?.target?.files?.length ) return;
					try {
						const { decodedText } = await html5QrCode.scanFileV2( e.target.files[ 0 ], false );
						setText( decodedText );
						inputRef.current.value = null;
					} catch ( e ) {
						enqueueSnackbar( e?.response?.data || e?.message || e, { variant: 'error' } );
					}
				}}
			/>
			<IconButton onClick={() => inputRef.current?.click()}>
				<PhotoIcon/>
			</IconButton>
		</Fragment>
	);
}
