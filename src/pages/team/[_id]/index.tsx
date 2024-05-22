import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainPageDetailTeam from '~/components/pages/team/MainPageDetailTeam';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết team</title>
				<meta name='description' content='Chi tiết team' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageDetailTeam />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết team'>{Page}</BaseLayout>;
};
