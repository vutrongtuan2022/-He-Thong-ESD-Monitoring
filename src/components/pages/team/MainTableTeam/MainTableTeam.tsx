import React from 'react';

import {ITeam, PropsMainTableTeam} from './interfaces';
import styles from './MainTableTeam.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';

function MainTableTeam({}: PropsMainTableTeam) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _leaderUuid} = router.query;

	const pageListTeams = useQuery([QUERY_KEY.danh_sach_team, _pageSize, _keyword, _leaderUuid], {
		queryFn: () =>
			httpRequest({
				http: teamServices.pageListTeam({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: null,
					leaderUuid: _leaderUuid ? (_leaderUuid as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<DataWrapper
				data={pageListTeams?.data?.items}
				loading={pageListTeams.isLoading}
				noti={<Noti title='Team trống' des='Danh sách team trống!' />}
			>
				<Table
					data={pageListTeams?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: ITeam, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên team',
							render: (data: ITeam) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Mã team',
							render: (data: ITeam) => <>{data.code || '---'}</>,
						},
						{
							title: 'Người quản lý team',
							render: (data: ITeam) => <>{data.leaderName || '---'}</>,
						},
						{
							title: 'Số thành viên',
							render: (data: ITeam) => <>{data.totalUser || 0}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: ITeam) => <>{data.totalDevices || 0}</>,
						},
						{
							title: 'Khu vực',
							render: (data: ITeam) => <>{'---'}</>,
						},
						{
							title: 'Tác vụ',
							render: (data: ITeam) => (
								<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
									<IconCustom
										edit
										icon={<LuPencil fontSize={20} fontWeight={600} />}
										tooltip='Chỉnh sửa'
										color='#777E90'
										href={`/team/chinh-sua?_id=${data.uuid}`}
									/>

									<IconCustom
										delete
										icon={<Trash size='22' />}
										tooltip='Xóa'
										color='#777E90'
										// onClick={() => setDataChangeStatus(data)}
									/>
								</div>
							),
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={pageListTeams?.data?.pagination?.totalCount}
					dependencies={[_pageSize, _keyword, _leaderUuid]}
				/>
			</DataWrapper>
		</div>
	);
}

export default MainTableTeam;
