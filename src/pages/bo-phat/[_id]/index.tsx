import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainDetailTransmitter from '~/components/pages/bo-phat/MainDetailTransmitter';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết bộ phát</title>
				<meta name='description' content='Chi tiết bộ phát' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailTransmitter />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết bộ phát'>{Page}</BaseLayout>;
};
