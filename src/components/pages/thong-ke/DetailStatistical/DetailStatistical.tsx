import React from 'react';
import Image from 'next/image';

import {PropsDetailStatistical} from './interfaces';
import styles from './DetailStatistical.module.scss';
import TabNavLink from '~/components/common/TabNavLink';
import {PATH} from '~/constants/config';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';

function DetailStatistical({}: PropsDetailStatistical) {
	return (
		<div className={styles.container}>
			<h4>Báo cáo chi tiết</h4>
			<TabNavLink
				outline
				query='_type'
				listHref={[
					{
						pathname: PATH.ThongKe,
						query: null,
						title: 'Danh sách bộ phát NG',
					},
					{
						pathname: PATH.ThongKe,
						query: 'time-ng',
						title: 'Thời gian NG các team',
					},
					{
						pathname: PATH.ThongKe,
						query: 'total-time',
						title: 'Thời gian lao động của các team',
					},
				]}
			/>
			<div className={styles.flex}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search placeholder='Tìm kiếm theo số MAC, tên thiết bị' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Team'
							query='_team'
							listFilter={[
								{id: 1, name: 'Team 1'},
								{id: 2, name: 'Team 2'},
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DetailStatistical;
