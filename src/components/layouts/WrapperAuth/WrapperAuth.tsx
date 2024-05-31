import React from 'react';
import {PropsWrapperAuth} from './interfaces';
import styles from './WrapperAuth.module.scss';
import RequiredLogout from '~/components/protected/RequiredLogout';
import AvicLogo from '../BaseLayout/components/AvicLogo';

function WrapperAuth({children}: PropsWrapperAuth) {
	return (
		<RequiredLogout>
			<div className={styles.container}>
				<div className={styles.avic_logo}>
					<AvicLogo />
				</div>
				{children}
			</div>
		</RequiredLogout>
	);
}

export default WrapperAuth;
