import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';

import MainGateway from '~/components/pages/gateway/MainGateway';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý gateway</title>
				<meta name='description' content='Quản lý gateway' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainGateway />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý gateway'>{Page}</BaseLayout>;
};
