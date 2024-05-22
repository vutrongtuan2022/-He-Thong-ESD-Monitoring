import React from 'react';

import {INGHistory, PropsTableHistory} from './interfaces';
import styles from './TableHistory.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import teamServices from '~/services/teamServices';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import ngHistoryServices from '~/services/ngHistoryServices';

function TableHistory({}: PropsTableHistory) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listHistoryTeams = useQuery([QUERY_KEY.danh_sach_lich_su_team, _id, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: ngHistoryServices.listNGhistory({
					keyword: '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					teamUuid: _id as string,
					deviceUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<div>
			<DataWrapper
				data={listHistoryTeams?.data?.items}
				loading={listHistoryTeams.isLoading}
				noti={<Noti title='Lịch sử trống' des='Danh sách lịch sử trống!' disableButton />}
			>
				<Table
					data={listHistoryTeams?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: INGHistory, index: number) => <>{index + 1}</>,
						},
						// {
						// 	title: 'Mã thiết bị',
						// 	render: (data: INGHistory) => (
						// 		<Link href={`/bo-phat/${data.uuid}`} className={styles.link}>
						// 			{data. || '---'}
						// 		</Link>
						// 	),
						// },
						// {
						// 	title: 'Mã team',
						// 	render: (data: INGHistory) => <>{data.code || '---'}</>,
						// },
						// {
						// 	title: 'Người quản lý',
						// 	render: (data: INGHistory) => <>{data.leaderName || '---'}</>,
						// },
						// {
						// 	title: 'Số thành viên',
						// 	render: (data: INGHistory) => <>{data.totalUser || 0}</>,
						// },
						// {
						// 	title: 'Số thiết bị',
						// 	render: (data: INGHistory) => <>{data.totalDevices || 0}</>,
						// },
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listHistoryTeams?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableHistory;
