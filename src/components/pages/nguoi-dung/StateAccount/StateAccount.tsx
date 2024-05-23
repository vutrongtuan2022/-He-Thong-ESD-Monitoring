import React, {Fragment} from 'react';

import {PropsStateAccount} from './interfaces';
import {FaCheckCircle} from 'react-icons/fa';
import {FaCircleExclamation} from 'react-icons/fa6';
import styles from './StateAccount.module.scss';
import {STATE_ONLINE_DEVICE} from '~/constants/config/enum';

function StateAccount({status}: PropsStateAccount) {
	const textColor = status === STATE_ONLINE_DEVICE.ONLINE ? styles.greenText : styles.redText;
	const Icon = status === STATE_ONLINE_DEVICE.ONLINE ? FaCheckCircle : FaCircleExclamation;

	return (
		<Fragment>
			{!status ? (
				<div>---</div>
			) : (
				<div className={`${styles.statusContainer} ${textColor}`}>
					<Icon />

					{status === STATE_ONLINE_DEVICE.ONLINE ? 'Online' : 'Offline'}
				</div>
			)}
		</Fragment>
	);
}

export default StateAccount;
