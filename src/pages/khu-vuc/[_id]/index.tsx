import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';

import MainDetailArea from '~/components/pages/khu-vuc/MainDetailArea';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết khu vực</title>
				<meta name='description' content='Chi tiết khu vực' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailArea />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết khu vực'>{Page}</BaseLayout>;
};
