import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import PageDetailUser from '~/components/pages/nguoi-dung/PageDetailUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết người dùng</title>
				<meta name='description' content='Chi tiết người dùng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<PageDetailUser />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết Quán lý người dùng'>{Page}</BaseLayout>;
};
