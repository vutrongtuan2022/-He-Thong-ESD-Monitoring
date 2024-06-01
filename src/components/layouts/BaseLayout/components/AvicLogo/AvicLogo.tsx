import React from 'react';

import {PropsAvicLogo} from './interfaces';

import styles from './AvicLogo.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import clsx from 'clsx';

function AvicLogo({}: PropsAvicLogo) {
	const {fullMenu, isMobile} = useSelector((state: RootState) => state.site);

	return (
		<div className={clsx(styles.container, {[styles.small]: !fullMenu || isMobile})}>
			<div className={styles.main}>
				<Image src={icons.avic_avi_logo} alt='logo avic' className={styles.image_avi} />
				<div className={styles.main_farame}>
					<Image src={icons.avic_c_logo} alt='logo avic' className={styles.image_c} />
					<div className={styles.box}>
						<Image src={icons.rotate_avic} alt='rotate avic' className={styles.image_rotate} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default AvicLogo;
