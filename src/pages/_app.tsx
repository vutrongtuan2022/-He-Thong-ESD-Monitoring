import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tippy.js/dist/tippy.css';
import '~/styles/_globals.scss';
import 'moment/locale/vi';

import Head from 'next/head';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import type {AppProps} from 'next/app';
import trans from '~/locale/i18n';

import {Fragment, ReactElement, ReactNode} from 'react';

import AppProvider from '~/contexts/AppProvider';

export const metadata = {
	icons: {
		icon: '/favicon.ico',
	},
};

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({Component, pageProps}: AppPropsWithLayout) {
	const router = useRouter();
	const {locale} = router;
	trans.changeLanguage(locale);

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<Fragment>
			<Head>
				<title>Quản lý ESD</title>
				<meta name='description' content='Quản lý ESD' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale = 1.0' />
			</Head>
			<AppProvider pageProps={pageProps}>{getLayout(<Component {...pageProps} />)}</AppProvider>
		</Fragment>
	);
}
