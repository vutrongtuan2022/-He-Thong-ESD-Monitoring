import {RootState, store} from '~/redux/store';
import {useCallback} from 'react';

import Link from 'next/link';
import {Menu, PATH} from '~/constants/config';
import {PropsMenuTab} from './interfaces';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import styles from './MenuTab.module.scss';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {setFullMenu} from '~/redux/reducer/site';
import ImageFill from '~/components/common/ImageFill';
import AvicLogo from '../AvicLogo';
import i18n from '~/locale/i18n';

function MenuTab({}: PropsMenuTab) {
	const router = useRouter();

	const {isMobile, fullMenu} = useSelector((state: RootState) => state.site);

	const checkActive = useCallback(
		(pathname: string) => {
			const currentRoute = router.pathname.split('/')[1];
			return pathname == `/${currentRoute}`;
		},
		[router]
	);

	return (
		<div id='menuTab' className={styles.container}>
			<div
				className={clsx(styles.header, {
					[styles.header_small]: !fullMenu,
				})}
			>
				<Link href={PATH.Home} className={styles.left}>
					<ImageFill src={icons.logo} className={styles.logo_icon} alt='Logo' />
					{fullMenu && <h4 className={styles.title_logo}>Monitoring</h4>}
				</Link>
			</div>
			<div
				className={clsx(styles.menu, {
					[styles.menu_small]: !fullMenu,
				})}
			>
				{Menu.map((v, i) => (
					<div className={styles.group} key={i}>
						<div className={styles.groupTitle}>{i18n.t(v.title)}</div>
						<div className={styles.menuGroup}>
							{v.group.map((item, j) => (
								<Link
									onClick={() => {
										isMobile && store.dispatch(setFullMenu(!fullMenu));
									}}
									href={item.path}
									className={clsx(styles.itemGroup, {
										[styles.active]: checkActive(item.path),
										[styles.small]: !fullMenu,
									})}
									key={j}
								>
									<div className={styles.icon}>
										<item.icon size={20} />
									</div>
									{fullMenu ? <p className={styles.item_text}>{i18n.t(item.title)}</p> : null}
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
			<AvicLogo />
		</div>
	);
}

export default MenuTab;
