import React, {useState} from 'react';

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
import useDebounce from '~/common/hooks/useDebounce';
import SearchInput from '~/components/common/SearchInput';
import i18n from '~/locale/i18n';

function TableTeam({}: PropsTableTeam) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const [keyword, setKeyword] = useState<string>('');

	const keywordDebounce = useDebounce(keyword, 500);

	const listTeamArea = useQuery([QUERY_KEY.danh_sach_team_khu_vuc, _page, keywordDebounce, _id, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: teamServices.pageListTeam({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					areaUuid: _id as string,
					keyword: keywordDebounce,
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
			<div className={'mb'} style={{maxWidth: '320px'}}>
				<SearchInput placeholder={i18n.t('Common.SearchNameAndID')} keyword={keyword} setKeyword={setKeyword} />
			</div>
			<DataWrapper
				data={listTeamArea?.data?.items}
				loading={listTeamArea.isLoading}
				noti={<Noti title={i18n.t('Team.DrumTeam')} des={i18n.t('Team.TeamListIsEmpty')} disableButton />}
			>
				<Table
					data={listTeamArea?.data?.items}
					column={[
						{
							title: i18n.t('Common.No'),
							render: (data: ITeamChild, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Overview.TeamName'),
							render: (data: ITeamChild) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Overview.TeamCode'),
							render: (data: ITeamChild) => <>{data.code || '---'}</>,
						},
						{
							title: i18n.t('Common.Manager'),
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
					total={listTeamArea?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableTeam;
