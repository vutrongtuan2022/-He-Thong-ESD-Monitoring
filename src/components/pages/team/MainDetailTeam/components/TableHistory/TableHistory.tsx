import React from 'react';

import {PropsTableHistory} from './interfaces';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import ngHistoryServices from '~/services/ngHistoryServices';
import {IDeviceNGHistory} from '~/components/pages/bo-phat/HistoryDevice/interfaces';
import Link from 'next/link';

import styles from './TableHistory.module.scss';
import Moment from 'react-moment';
import {formatTimeHistory} from '~/common/funcs/optionConvert';

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
					deviceUuid: null,
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
							render: (data: IDeviceNGHistory, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Số MAC',
							render: (data: IDeviceNGHistory) => (
								<Link href={`/bo-phat/${data.deviceUuid}`} className={styles.link}>
									{data.macNumber || '---'}
								</Link>
							),
						},
						{
							title: 'Tên thiết bị',
							render: (data: IDeviceNGHistory) => <>{data.deviceName || '---'}</>,
						},
						{
							title: 'Giá trị tĩnh điện',
							render: (data: IDeviceNGHistory) => <>{data.edsStatic}</>,
						},
						{
							title: 'Thời gian phát hiện NG',
							render: (data: IDeviceNGHistory) => <Moment date={data.timeNgStart} format='HH:mm, DD/MM/YYYY' />,
						},
						{
							title: 'Khoảng thời gian NG',
							render: (data: IDeviceNGHistory) => <>{formatTimeHistory(data.totalNgMinutes || 0)}</>,
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 20}
				total={listHistoryTeams?.data?.pagination?.totalCount}
				dependencies={[_id, _pageSize, _table]}
			/>
		</div>
	);
}

export default TableHistory;
