import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';

import MainGateway from '~/components/pages/gateway/MainGateway';
import i18n from '~/locale/i18n';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Gateway.GatewayList')}</title>
				<meta name='description' content={i18n.t('Gateway.GatewayList')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MainGateway />
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title={i18n.t('Gateway.GatewayList')}>{Page}</BaseLayout>;
};
