import Head from 'next/head';
import React, {Fragment, ReactElement} from 'react';
import MainPageSetting from '~/components/pages/settings/MainPageSetting';
import BaseLayout from '~/components/layouts/BaseLayout';
import i18n from '~/locale/i18n';

const Page = () => {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Setting.Setting')}</title>
				<meta name='description' content={i18n.t('Setting.Setting')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainPageSetting />
		</Fragment>
	);
};

export default Page;
Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title={i18n.t('Setting.Setting')}>{Page}</BaseLayout>;
};
