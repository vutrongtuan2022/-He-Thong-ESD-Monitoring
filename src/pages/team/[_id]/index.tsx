import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageUpdate from '~/components/pages/team/MainPageUpdate';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa team</title>
				<meta name='description' content='Chỉnh sửa team' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageUpdate />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chỉnh sửa team'>{Page}</BaseLayout>;
};
