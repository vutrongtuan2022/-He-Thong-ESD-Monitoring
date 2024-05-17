import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import UpdatePageUser from '~/components/pages/nguoi-dung/UpdatePageUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chỉnh sửa người dùng</title>
				<meta name='description' content='Quản lý người dùng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<UpdatePageUser />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý người dùng'>{Page}</BaseLayout>;
};
