import React from 'react';

import {ITeamChild, PropsTableTeam} from './interfaces';
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

	const {_id, _page, _pageSize, _table} = router.query;

	const listTeamArea = useQuery([QUERY_KEY.danh_sach_team_khu_vuc, _page, _id, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: teamServices.pageListTeam({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					areaUuid: _id as string,
					keyword: '',
					leaderUuid: null,
					status: null,
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
				data={listTeamArea?.data?.items}
				loading={listTeamArea.isLoading}
				noti={<Noti title='Team trống' des='Danh sách team trống!' disableButton />}
			>
				<Table
					data={listTeamArea?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: ITeamChild, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên team',
							render: (data: ITeamChild) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Mã team',
							render: (data: ITeamChild) => <>{data.code || '---'}</>,
						},
						{
							title: 'Người quản lý',
							render: (data: ITeamChild) => <>{data.leaderName || '---'}</>,
						},
						{
							title: 'Số thành viên',
							render: (data: ITeamChild) => <>{data.totalUser || 0}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: ITeamChild) => <>{data.totalDevices || 0}</>,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listTeamArea?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableTeam;
