import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageDetailStaff from '~/components/pages/nhan-vien/MainPageDetailStaff';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết nhân viên</title>
				<meta name='description' content='Chi tiết nhân viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageDetailStaff />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết nhân viên'>{Page}</BaseLayout>;
};
