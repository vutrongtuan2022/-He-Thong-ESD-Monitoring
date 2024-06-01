import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageStatistical from '~/components/pages/report/MainPageStatistical';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Báo cáo thống kê</title>
				<meta name='description' content='Báo cáo thống kê' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageStatistical />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Báo cáo thống kê'>{Page}</BaseLayout>;
};
