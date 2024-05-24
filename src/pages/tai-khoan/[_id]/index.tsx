import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import PageDetailAccount from '~/components/pages/tai-khoan/PageDetailAccount';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết tài khoản</title>
				<meta name='description' content='Chi tiết tài khoản' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<PageDetailAccount />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết tài khoản'>{Page}</BaseLayout>;
};
