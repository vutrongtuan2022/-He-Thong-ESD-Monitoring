import {PropsBaseLayout} from './interfaces';

import Header from './components/Header';
import MenuTab from './components/MenuTab';
import clsx from 'clsx';
import styles from './BaseLayout.module.scss';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import RequireAuth from '~/components/protected/RequiredAuth';

function BaseLayout({children, title, bgLight = false}: PropsBaseLayout) {
	const {fullMenu} = useSelector((state: RootState) => state.site);

	return (
		<RequireAuth>
			<div className={clsx(styles.container, {[styles.hidden]: !fullMenu, [styles.bgLight]: bgLight})}>
				<div className={styles.header}>
					<Header title={title} />
				</div>
				<div className={clsx(styles.tab)}>
					<MenuTab />
				</div>
				<div className={styles.main}>{children}</div>
			</div>
		</RequireAuth>
	);
}

export default BaseLayout;
