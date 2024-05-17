import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainTransmitter from '~/components/pages/bo-phat/MainTransmitter';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý bộ phát</title>
				<meta name='description' content='Quản lý bộ phát' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainTransmitter />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý bộ phát'>{Page}</BaseLayout>;
};
