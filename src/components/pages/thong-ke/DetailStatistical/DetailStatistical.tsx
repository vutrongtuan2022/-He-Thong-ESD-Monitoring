import React from 'react';

import {PropsDetailStatistical} from './interfaces';
import styles from './DetailStatistical.module.scss';
import TabNavLink from '~/components/common/TabNavLink';
import {PATH} from '~/constants/config';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {useRouter} from 'next/router';
import TableTransmitterList from '../TableTransmitterList';
import TableTimeOfTeam from '../TableTimeOfTeam';
import TableWorkingTimeOfTeam from '../TableWorkingTimeOfTeam';

function DetailStatistical({}: PropsDetailStatistical) {
	const router = useRouter();
	const {_type} = router.query;
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
						<Search placeholder='Tìm kiếm theo tên,mã nhân viên' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Nhân viên'
							query='_team'
							listFilter={[
								{id: 1, name: 'Nhân viên 1'},
								{id: 2, name: 'Nhân viên 2'},
							]}
						/>
					</div>
				</div>
			</div>
			{!_type && <div><TableTransmitterList /></div>}
			{_type == 'time-ng' && <div><TableTimeOfTeam/></div>}
			{_type == 'total-time' && <div><TableWorkingTimeOfTeam/></div>}
		</div>
	);
}

export default DetailStatistical;
