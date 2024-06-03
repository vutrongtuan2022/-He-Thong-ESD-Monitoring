import Head from 'next/head';
import React, {Fragment} from 'react';
import WrapperAuth from '~/components/layouts/WrapperAuth';
import FormLogin from '~/components/pages/auth/FormLogin';
import i18n from '~/locale/i18n';

export default function PageLogin() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Common.Login')}</title>
				<meta name='description' content={i18n.t('Common.Login')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperAuth>
				<FormLogin />
			</WrapperAuth>
		</Fragment>
	);
}
