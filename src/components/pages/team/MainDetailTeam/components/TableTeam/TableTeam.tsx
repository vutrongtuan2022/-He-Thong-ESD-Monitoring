import React from 'react';

import {PropsTableTeam} from './interfaces';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';

import styles from './TableTeam.module.scss';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Link from 'next/link';

function TableTeam({}: PropsTableTeam) {
	const router = useRouter();

	const {_page, _pageSize} = router.query;

	const pageListTeams = useQuery([QUERY_KEY.danh_sach_team, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: teamServices.pageListTeam({
					keyword: '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: null,
					leaderUuid: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div>
			<DataWrapper
				data={pageListTeams?.data?.items}
				loading={pageListTeams.isLoading}
				noti={<Noti title='Team trống' des='Danh sách team trống!' disableButton />}
			>
				<Table
					data={pageListTeams?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: any, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên team',
							render: (data: any) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Mã team',
							render: (data: any) => <>{data.code || '---'}</>,
						},
						{
							title: 'Người quản lý',
							render: (data: any) => <>{data.leaderName || '---'}</>,
						},
						{
							title: 'Số thành viên',
							render: (data: any) => <>{data.totalUser || 0}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: any) => <>{data.totalDevices || 0}</>,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={pageListTeams?.data?.pagination?.totalCount}
					dependencies={[_pageSize]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableTeam;
