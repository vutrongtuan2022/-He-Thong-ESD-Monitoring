import React from 'react';

import {PropsTableUser} from './interfaces';
import styles from './TableUser.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Link from 'next/link';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {useRouter} from 'next/router';
import userServices from '~/services/userServices';

function TableUser({}: PropsTableUser) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listUserTeams = useQuery([QUERY_KEY.danh_sach_nhan_vien_team, _id, _page, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					keyword: '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: null,
					teamUuid: _id as string,
					timeCreated: {
						fromDate: null,
						toDate: null,
					},
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
				data={listUserTeams?.data?.items}
				loading={listUserTeams.isLoading}
				noti={<Noti title='Nhân viên trống' des='Danh sách nhân viên trống!' disableButton />}
			>
				<Table
					data={listUserTeams?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: any, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Mã nhân viên',
							render: (data: any) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Tên nhân viên',
							render: (data: any) => <>{data.code || '---'}</>,
						},
						{
							title: 'Email',
							render: (data: any) => <>{data.leaderName || '---'}</>,
						},
						{
							title: 'Số điện thoại',
							render: (data: any) => <>{data.totalUser || 0}</>,
						},
						{
							title: 'Thuộc team',
							render: (data: any) => <>{data.totalDevices || 0}</>,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listUserTeams?.data?.pagination?.totalCount}
					dependencies={[_pageSize]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableUser;
