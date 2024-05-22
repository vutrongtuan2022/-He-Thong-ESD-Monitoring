import React from 'react';

import {PropsItemDashboard} from './interfaces';
import styles from './ItemDashboard.module.scss';
import {LuLoader} from 'react-icons/lu';

function ItemDashboard({text, value, icon, isLoading}: PropsItemDashboard) {
	return (
		<div className={styles.container}>
			<div className={styles.info}>
				{isLoading ? (
					<div className={styles.loading}>
						<LuLoader size={24} color='#2367ed' />
					</div>
				) : (
					<p className={styles.value}>{value}</p>
				)}
				<p className={styles.text}>{text}</p>
			</div>
			<div className={styles.icon}>{icon}</div>
		</div>
	);
}

export default ItemDashboard;
