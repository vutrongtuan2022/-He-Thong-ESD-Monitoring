import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import UpdatePageUser from '~/components/pages/nguoi-dung/UpdatePageUser';
import MainPageCreateStaff from '~/components/pages/nhan-vien/MainCreateUser';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thêm nhân viên</title>
				<meta name='description' content='Thêm nhân viên' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainPageCreateStaff />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm nhân viên'>{Page}</BaseLayout>;
};
