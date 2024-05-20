import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageCreate from '~/components/pages/team/MainPageCreate';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm mới team</title>
				<meta name='description' content='Thêm mới team' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageCreate />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm mới team'>{Page}</BaseLayout>;
};
