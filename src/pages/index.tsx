import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MaindDashboard from '~/components/pages/dashboard/MainDashboard';
import i18n from '~/locale/i18n';

export default function Home() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Common.home')}</title>
				<meta name='description' content={i18n.t('Common.home')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MaindDashboard />
		</Fragment>
	);
}

Home.getLayout = function (Page: ReactElement) {
	return <BaseLayout title={i18n.t('Overview.text')}>{Page}</BaseLayout>;
};
