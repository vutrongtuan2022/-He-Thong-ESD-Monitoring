import React from 'react';

import {PropsItemDashboard} from './interfaces';
import styles from './ItemDashboard.module.scss';

function ItemDashboard({text, value, icon}: PropsItemDashboard) {
	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<p className={styles.value}>{value}</p>
				<p className={styles.text}>{text}</p>
			</div>
			<div className={styles.icon}>{icon}</div>
		</div>
	);
}

export default ItemDashboard;
