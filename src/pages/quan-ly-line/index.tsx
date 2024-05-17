import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageLine from '~/components/pages/quan-ly-line/MainPageLine';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý line</title>
				<meta name='description' content='Quản lý line' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageLine />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý line'>{Page}</BaseLayout>;
};
