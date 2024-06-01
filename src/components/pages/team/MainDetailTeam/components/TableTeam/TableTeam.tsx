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
import i18n from '~/locale/i18n';

function TableTeam({}: PropsTableTeam) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listTeamChild = useQuery([QUERY_KEY.danh_sach_team_con, _page, _id, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: teamServices.listTeamChild({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					uuid: _id as string,
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
				data={listTeamChild?.data?.items}
				loading={listTeamChild.isLoading}
				noti={<Noti title={i18n.t('Team.Teamtrong')} des={i18n.t('Team.Danhsachteamtrong')} disableButton />}
			>
				<Table
					data={listTeamChild?.data?.items}
					column={[
						{
							title: i18n.t('Common.No'),
							render: (data: ITeamChild, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Team.TeamName'),
							render: (data: ITeamChild) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Team.IDTeam'),
							render: (data: ITeamChild) => <>{data.code || '---'}</>,
						},
						{
							title: i18n.t('Team.TeamManager'),
							render: (data: ITeamChild) => <>{data.leaderName || '---'}</>,
						},
						{
							title: i18n.t('Team.NumberofMember'),
							render: (data: ITeamChild) => <>{data.totalUser || 0}</>,
						},
						{
							title: i18n.t('Team.NumberofDevices'),
							render: (data: ITeamChild) => <>{data.totalDevices || 0}</>,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listTeamChild?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableTeam;
