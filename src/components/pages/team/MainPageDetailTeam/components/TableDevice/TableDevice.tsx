import React from 'react';

import {PropsTableDevice} from './interfaces';
import styles from './TableDevice.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import deviceServices from '~/services/deviceServices';
import {IDevice} from '~/components/pages/bo-phat/MainTransmitter/interfaces';
import Moment from 'react-moment';
import StatusDevice from '~/components/pages/bo-phat/StatusDevice';

function TableDevice({}: PropsTableDevice) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listDeviceTeams = useQuery([QUERY_KEY.danh_sach_bo_phat_team, _id, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: deviceServices.listDevice({
					keyword: '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: null,
					teamUuid: _id as string,
					battery: {
						toDouble: 100,
						fromDouble: 0,
					},
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
			<DataWrapper
				data={listDeviceTeams?.data?.items}
				loading={listDeviceTeams.isLoading}
				noti={<Noti title='Bộ phát trống' des='Danh sách bộ phát trống!' disableButton />}
			>
				<Table
					data={listDeviceTeams?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: IDevice, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Số MAC',
							render: (data: IDevice) => (
								<Link href={`/bo-phat/${data.uuid}`} className={styles.link}>
									{data.macNumber || '---'}
								</Link>
							),
						},
						{
							title: 'Tên thiết bị',
							render: (data: IDevice) => <>{data.name || '---'}</>,
						},
						{
							title: 'Phần trăm pin',
							render: (data: IDevice) => <>{data.battery}%</>,
						},
						{
							title: 'Trạng thái',
							render: (data: IDevice) => <StatusDevice status={data.state} />,
						},
						{
							title: 'Oniline lần cuối',
							render: (data: IDevice) => <Moment date={data.timeLastOnline} format='HH: mm, DD/MM/YYYY' />,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listDeviceTeams?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableDevice;
