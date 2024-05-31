import React from 'react';

import {PropsMainTreeTeam} from './interfaces';
import styles from './MainTreeTeam.module.scss';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import DataWrapper from '~/components/common/DataWrapper';
import TreeTeam from '../TreeTeam';
import Noti from '~/components/common/DataWrapper/components/Noti';
import i18n from '~/locale/i18n';

function MainTreeTeam({}: PropsMainTreeTeam) {
	const listTreeTeams = useQuery([QUERY_KEY.danh_sach_tree_team], {
		queryFn: () =>
			httpRequest({
				http: teamServices.listTeamTree({
					uuid: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<DataWrapper
				data={listTreeTeams?.data}
				loading={listTreeTeams.isLoading}
				noti={<Noti disableButton title={i18n.t('Team.teamtrong')} des={i18n.t('Team.Danhsachteamtrong')} />}
			>
				{listTreeTeams?.data?.map((v: any) => (
					<TreeTeam key={v?.uuid} team={v} level={0} />
				))}
			</DataWrapper>
		</div>
	);
}

export default MainTreeTeam;
