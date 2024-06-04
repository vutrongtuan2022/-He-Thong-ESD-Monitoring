import React, {useState} from 'react';

import {PropsTableDevice} from './interfaces';
import styles from './TableDevice.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {httpRequest} from '~/services';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import deviceServices from '~/services/deviceServices';
import {IDevice} from '~/components/pages/device/MainDevice/interfaces';
import Moment from 'react-moment';
import StateDevice from '~/components/pages/device/StateDevice';
import i18n from '~/locale/i18n';
import SearchInput from '~/components/common/SearchInput';
import useDebounce from '~/common/hooks/useDebounce';

function TableDevice({}: PropsTableDevice) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const [keyword, setKeyword] = useState<string>('');

	const keywordDebounce = useDebounce(keyword, 500);

	const listDeviceTeams = useQuery([QUERY_KEY.danh_sach_bo_phat_team, _id, _page, _pageSize, keywordDebounce], {
		queryFn: () =>
			httpRequest({
				http: deviceServices.listDevice({
					keyword: keywordDebounce,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					teamUuid: _id as string,
					status: null,
					battery: null,
					ngState: null,
					onlineState: null,
					edS_Static: null,
					factoryAreaUuid: null,
					gatewayUuid: null,
					timeLastOnline: null,
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
				data={listDeviceTeams?.data?.items}
				loading={listDeviceTeams.isLoading}
				noti={<Noti title={i18n.t('Team.DeviceIsEmpty')} des={i18n.t('Team.ListDeviceIsEmpty')} disableButton />}
			>
				<Table
					data={listDeviceTeams?.data?.items}
					column={[
						{
							title: i18n.t('Common.No'),
							render: (data: IDevice, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Common.MACNumber'),
							render: (data: IDevice) => (
								<Link href={`/device/${data.uuid}`} className={styles.link}>
									{data.macNumber || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Team.NameDevice'),
							render: (data: IDevice) => <>{data.name || '---'}</>,
						},
						{
							title: i18n.t('Team.BateryPercent'),
							render: (data: IDevice) => <>{data.battery}%</>,
						},
						{
							title: i18n.t('Common.Status'),
							render: (data: IDevice) => <StateDevice status={data.state} />,
						},
						{
							title: i18n.t('Team.LastOnline'),
							render: (data: IDevice) => <Moment date={data.timeLastOnline} format='HH: mm, DD/MM/YYYY' />,
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 20}
				total={listDeviceTeams?.data?.pagination?.totalCount}
				dependencies={[_id, _pageSize, _table]}
			/>
		</div>
	);
}

export default TableDevice;
