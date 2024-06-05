import Head from 'next/head';
import React, {Fragment} from 'react';

import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import ImageFill from '~/components/common/ImageFill';
import background from '~/constants/images/background';

import styles from './Page404.module.scss';
import i18n from '~/locale/i18n';

function PageNotFound() {
	return (
		<Fragment>
			<Head>
				<title>{i18n.t('Page404.Page404')}</title>
				<meta name='description' content={i18n.t('Page404.Page404')} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className={styles.container}>
				<div>
					<ImageFill src={background.image404} className={styles.image} />
				</div>
				<h4 className={styles.title}>{i18n.t('Page404.NotFound')}</h4>
				<p className={styles.text}>{i18n.t('Page404.Page404Sorry')}</p>
				<div className={styles.btn}>
					<Button href={PATH.Home} primary rounded_2 p_12_32 size_bold bold>
						{i18n.t('Page404.BackHome')}
					</Button>
				</div>
			</div>
		</Fragment>
	);
}

export default PageNotFound;
