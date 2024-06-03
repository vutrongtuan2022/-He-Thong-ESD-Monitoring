import {PropsHeader} from './interfaces';
import TippyHeadless from '@tippyjs/react/headless';

import styles from './Header.module.scss';
import {useMemo, useState} from 'react';
import clsx from 'clsx';
import icons from '~/constants/images/icons';
import Avatar from '~/components/common/Avatar';
import BoxMenuProfile from '../BoxMenuProfile';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import {setFullMenu} from '~/redux/reducer/site';
import BoxNoti from '../BoxNoti';
import {Languageses} from '~/constants/config';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {RiArrowDownSFill} from 'react-icons/ri';
import Image from 'next/image';
import ImageFill from '~/components/common/ImageFill';

function Header({title}: PropsHeader) {
	const router = useRouter();

	const {fullMenu} = useSelector((state: RootState) => state.site);
	const {infoUser} = useSelector((state: RootState) => state.user);

	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [openNoti, setOpenNoti] = useState<boolean>(false);
	const [openLanguagese, setOpenLanguagese] = useState<boolean>(false);

	const chooseLang = useMemo(() => Languageses.find((v) => v.code == router.locale), [router.locale]);

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
					visible={openLanguagese}
					onClickOutside={() => setOpenLanguagese(false)}
					placement='bottom'
					render={() => (
						<div className={styles.option}>
							{Languageses.map((v) => (
								<Link
									key={v.code}
									locale={v.code}
									href={router.asPath}
									className={clsx(styles.lang_item, {
										[styles.active]: chooseLang?.code == v.code,
									})}
									onClick={() => setOpenLanguagese(false)}
								>
									<Image src={v?.icon} alt='icon lang' width={20} height={16} />
									<p>{v?.title}</p>
								</Link>
							))}
						</div>
					)}
				>
					<div className={styles.lang} onClick={() => setOpenLanguagese(!openLanguagese)}>
						<Image src={chooseLang?.icon} alt='icon lang' width={20} height={16} />
						<p>{chooseLang?.title}</p>
						<i
							className={clsx(styles.icon_arrow, {
								[styles.active_icon]: openLanguagese,
							})}
						>
							<RiArrowDownSFill />
						</i>
					</div>
				</TippyHeadless>
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
						<p className={styles.name}>{infoUser?.fullname}</p>
						<Avatar src={`${process.env.NEXT_PUBLIC_AVATAR}/${infoUser?.avatar}`} className={styles.avatar} />
					</div>
				</TippyHeadless>
			</div>
		</div>
	);
}

export default Header;
