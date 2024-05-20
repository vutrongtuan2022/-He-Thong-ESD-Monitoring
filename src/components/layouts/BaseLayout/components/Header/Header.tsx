import {PropsHeader} from './interfaces';
import TippyHeadless from '@tippyjs/react/headless';

import styles from './Header.module.scss';
import {useState} from 'react';
import ImageFill from '~/components/common/ImageFill';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import Avatar from '~/components/common/Avatar';
import BoxMenuProfile from '../BoxMenuProfile';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import {setFullMenu} from '~/redux/reducer/site';
import BoxNoti from '../BoxNoti';

function Header({title}: PropsHeader) {
	const {fullMenu} = useSelector((state: RootState) => state.site);

	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [openNoti, setOpenNoti] = useState<boolean>(false);

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<div className={styles.groupArrows}>
					<div
						className={clsx(styles.arrow, {
							[styles.active]: !fullMenu,
						})}
						onClick={() => store.dispatch(setFullMenu(!fullMenu))}
					>
						<ImageFill src={icons.iconHamburger} className={styles.iconHamburger} />
					</div>
					<h4 className={styles.title}>{title}</h4>
				</div>
			</div>

			<div className={styles.right}>
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openNoti}
					onClickOutside={() => setOpenNoti(false)}
					placement='bottom'
					render={(attrs: any) => <BoxNoti />}
				>
					<div className={styles.icon_bell} onClick={() => setOpenNoti(!openNoti)}>
						<ImageFill style_1_1='true' src={icons.bell} />
					</div>
				</TippyHeadless>
				<TippyHeadless
					maxWidth={'100%'}
					interactive
					visible={openMenu}
					onClickOutside={() => setOpenMenu(false)}
					placement='bottom-end'
					render={(attrs: any) => <BoxMenuProfile onCLose={() => setOpenMenu(false)} />}
				>
					<div className={styles.info} onClick={() => setOpenMenu(!openMenu)}>
						<p className={styles.name}>Đặng Bá Trường</p>
						<Avatar src={''} className={styles.avatar} />
					</div>
				</TippyHeadless>
			</div>
		</div>
	);
}

export default Header;
