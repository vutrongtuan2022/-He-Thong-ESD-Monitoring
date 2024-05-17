import React from 'react';

import {PropsBreadcrumb} from './interfaces';
import styles from './Breadcrumb.module.scss';
import Link from 'next/link';
import {IoIosArrowForward} from 'react-icons/io';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

function Breadcrumb({listUrls, action}: PropsBreadcrumb) {
	const {fullMenu} = useSelector((state: RootState) => state.site);

	return (
		<div className={clsx(styles.container, {[styles.small]: !fullMenu})}>
			<div className={styles.line}></div>
			<div className={styles.main}>
				<div className={styles.breadcrumb}>
					{listUrls?.map((v, i) => (
						<div key={i} className={styles.item}>
							<Link
								href={v.path}
								className={clsx(styles.link, {[styles.pathNow]: i == listUrls.length - 1})}
								onClick={(e) => (!v.path || i == listUrls.length - 1) && e.preventDefault()}
							>
								{v.title}
							</Link>
							{i != listUrls.length - 1 && <IoIosArrowForward color='#23262F' />}
						</div>
					))}
				</div>
				{action}
			</div>
		</div>
	);
}

export default Breadcrumb;
