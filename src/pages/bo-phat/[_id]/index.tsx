import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import MainDetailDevice from '~/components/pages/bo-phat/MainDetailDevice';
import i18n from '~/locale/i18n';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Device.chitietbophat')}</title>
				<meta name='description' content={i18n.t('Device.chitietbophat')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainDetailDevice />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title={i18n.t('Device.chitietbophat')}>{Page}</BaseLayout>;
};
