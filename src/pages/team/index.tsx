import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageTeam from '~/components/pages/team/MainPageTeam';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Quản lý team</title>
				<meta name='description' content='Quản lý team' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageTeam />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý team'>{Page}</BaseLayout>;
};
