import Head from 'next/head';
import React, {Fragment} from 'react';
import WrapperAuth from '~/components/layouts/WrapperAuth';
import MainForgotPassword from '~/components/pages/auth/forgot-password/MainForgotPassword';
import i18n from '~/locale/i18n';

export default function PageForgotPassword() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('ForgotPass.ForgotPassWord')}</title>
				<meta name='description' content={i18n.t('ForgotPass.ForgotPassWord')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperAuth>
				<MainForgotPassword />
			</WrapperAuth>
		</Fragment>
	);
}
