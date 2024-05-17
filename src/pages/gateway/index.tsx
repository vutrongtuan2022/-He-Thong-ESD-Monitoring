import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';

import MainPageGateway from '~/components/pages/gateway/MainPageGateway';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý gateway</title>
				<meta name='description' content='Quản lý gateway' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageGateway />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý gateway'>{Page}</BaseLayout>;
};
