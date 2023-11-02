import type { MenuItemProps } from '@mui/joy';
import { MenuItem } from '@mui/joy';
import useAsyncLoading from '@/components/loaders/useAsyncLoading';

export default function AsyncMenuItem({ onClick, ...props }: MenuItemProps) {
	const [loading, onClickLoading] = useAsyncLoading();

	return <MenuItem disabled={loading} onClick={onClickLoading(onClick)} {...props} />;
}
