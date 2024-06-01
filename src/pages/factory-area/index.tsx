import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainFactoryArea from '~/components/pages/factory-area/MainFactoryArea';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý khu vực</title>
				<meta name='description' content='Quản lý khu vực' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainFactoryArea />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý khu vực'>{Page}</BaseLayout>;
};
