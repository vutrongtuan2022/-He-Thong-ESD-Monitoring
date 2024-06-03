import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainFactoryArea from '~/components/pages/factory-area/MainFactoryArea';
import i18n from '~/locale/i18n';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Area.AreaManagement')}</title>
				<meta name='description' content={i18n.t('Area.AreaManagement')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainFactoryArea />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title={i18n.t('Area.AreaManagement')}>{Page}</BaseLayout>;
};
