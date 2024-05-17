import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'tippy.js/dist/tippy.css';
import '~/styles/_globals.scss';

import Head from 'next/head';
import {NextPage} from 'next';
import type {AppProps} from 'next/app';
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
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<Fragment>
			<Head>
				<title>Quản lý trạm cân</title>
				<meta name='description' content='Quản lý trạm cân' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale = 1.0' />
			</Head>
			<AppProvider pageProps={pageProps}>{getLayout(<Component {...pageProps} />)}</AppProvider>
		</Fragment>
	);
}
