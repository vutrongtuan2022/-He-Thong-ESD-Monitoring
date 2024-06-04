import React, {useState} from 'react';

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
import {IDeviceNGHistory} from '~/components/pages/device/HistoryDevice/interfaces';
import Link from 'next/link';

import styles from './TableHistory.module.scss';
import Moment from 'react-moment';
import {formatTimeHistory} from '~/common/funcs/optionConvert';
import i18n from '~/locale/i18n';
import SearchInput from '~/components/common/SearchInput';
import useDebounce from '~/common/hooks/useDebounce';

function TableHistory({}: PropsTableHistory) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const [keyword, setKeyword] = useState<string>('');

	const keywordDebounce = useDebounce(keyword, 500);

	const listHistoryTeams = useQuery([QUERY_KEY.danh_sach_lich_su_team, _id, _page, _pageSize, keywordDebounce], {
		queryFn: () =>
			httpRequest({
				http: ngHistoryServices.listNGhistory({
					keyword: keywordDebounce,
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
			<div className={'mb'} style={{maxWidth: '320px'}}>
				<SearchInput keyword={keyword} setKeyword={setKeyword} />
			</div>
			<DataWrapper
				data={listHistoryTeams?.data?.items}
				loading={listHistoryTeams.isLoading}
				noti={<Noti title={i18n.t('Team.HistoryIsEmpty')} des={i18n.t('Team.ListHistoryIsEmpty')} disableButton />}
			>
				<Table
					data={listHistoryTeams?.data?.items}
					column={[
						{
							title: i18n.t('Common.No'),
							render: (data: IDeviceNGHistory, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Team.MACNumber'),
							render: (data: IDeviceNGHistory) => (
								<Link href={`/device/${data.deviceUuid}`} className={styles.link}>
									{data.macNumber || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Team.NameDevice'),
							render: (data: IDeviceNGHistory) => <>{data.deviceName || '---'}</>,
						},
						{
							title: i18n.t('Team.ElectrostaticValue'),
							render: (data: IDeviceNGHistory) => <>{data.edsStatic}</>,
						},
						{
							title: i18n.t('Team.NGDetectionTime'),
							render: (data: IDeviceNGHistory) => <Moment date={data.timeNgStart} format='HH:mm, DD/MM/YYYY' />,
						},
						{
							title: i18n.t('Team.NGTimePeriod'),
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
