import React from 'react';

import {PropsItemStatistical} from './interfaces';
import styles from './ItemStatistical.module.scss';

function ItemStatistical({text, value, icon, bg}: PropsItemStatistical) {
	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<p className={styles.value}>{value}</p>
				<p className={styles.text}>{text}</p>
			</div>
			<div style={{background: bg}} className={styles.icon}>
				{icon}
			</div>
		</div>
	);
}

export default ItemStatistical;
