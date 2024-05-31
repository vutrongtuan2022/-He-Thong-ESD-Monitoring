import React from 'react';

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
import {IDevice} from '~/components/pages/bo-phat/MainDevice/interfaces';
import Moment from 'react-moment';
import StateDevice from '~/components/pages/bo-phat/StateDevice';
import i18n from '~/locale/i18n';

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
			<DataWrapper
				data={listDeviceTeams?.data?.items}
				loading={listDeviceTeams.isLoading}
				noti={<Noti title={i18n.t('Device.Bophattrong')} des={i18n.t('Device.Danhsachbophattrong')} disableButton />}
			>
				<Table
					data={listDeviceTeams?.data?.items}
					column={[
						{
							title: i18n.t('Common.STT'),
							render: (data: IDevice, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Common.SoMAC'),
							render: (data: IDevice) => (
								<Link href={`/bo-phat/${data.uuid}`} className={styles.link}>
									{data.macNumber || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Common.Tenthietbi'),
							render: (data: IDevice) => <>{data.name || '---'}</>,
						},
						{
							title: i18n.t('Device.Phantrampin'),
							render: (data: IDevice) => <>{data.battery}%</>,
						},
						{
							title: i18n.t('Common.Status'),
							render: (data: IDevice) => <StateDevice status={data.state} />,
						},
						{
							title: i18n.t('Common.Onlinelancuoi'),
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
