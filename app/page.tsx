import helloWorld from './api/helloWorld';
import Main from './index';

export default async function Page() {
	const data = await helloWorld();
	return <Main data={data}/>;
}
