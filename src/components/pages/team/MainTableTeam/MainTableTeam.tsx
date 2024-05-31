import React, {useState} from 'react';

import {ITeam, PropsMainTableTeam} from './interfaces';
import styles from './MainTableTeam.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import {useRouter} from 'next/router';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Lock1, Unlock} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function MainTableTeam({}: PropsMainTableTeam) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status} = router.query;

	const [dataChangeStatus, setDataChangeStatus] = useState<ITeam | null>(null);

	const pageListTeams = useQuery([QUERY_KEY.danh_sach_team, _page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status], {
		queryFn: () =>
			httpRequest({
				http: teamServices.pageListTeam({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: _status ? Number(_status) : null,
					leaderUuid: _leaderUuid ? [_leaderUuid as string] : null,
					areaUuid: _areaUuid ? (_areaUuid as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Đổi trạng thái team
	const fucnChangeStatusTeam = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.ThaydoiTrangthaithanhcong'),
				http: teamServices.changeStatusTeam({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_team, _page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status]);
			}
		},
	});

	const handleChangeStatusTeam = async () => {
		fucnChangeStatusTeam.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatusTeam.isLoading} />
			<DataWrapper
				data={pageListTeams?.data?.items}
				loading={pageListTeams.isLoading}
				noti={<Noti title={i18n.t('Team.teamtrong')} des={i18n.t('Team.Danhsachteamtrong')} />}
			>
				<Table
					data={pageListTeams?.data?.items}
					column={[
						{
							title: i18n.t('Common.STT'),
							render: (data: ITeam, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Common.Mateam'),
							render: (data: ITeam) => <>{data.code || '---'}</>,
						},
						{
							title: i18n.t('Common.Tenteam'),
							render: (data: ITeam) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Common.NguoiQuanlyteam'),
							render: (data: ITeam) => <>{data.leaderName || '---'}</>,
						},
						{
							title: i18n.t('Common.Sothanhvien'),
							render: (data: ITeam) => <>{data.totalUser || 0}</>,
						},
						{
							title: i18n.t('Common.Sothietbi'),
							render: (data: ITeam) => <>{data.totalDevices || 0}</>,
						},
						{
							title: i18n.t('Common.Khuvuc'),
							render: (data: ITeam) => <>{data.areaName || '---'}</>,
						},
						{
							title: i18n.t('Common.Trangthai'),
							render: (data: ITeam) => (
								<>
									{data?.status == STATUS_GENERAL.SU_DUNG ? (
										<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Common.Dangsudung')}</p>
									) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
										<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Common.Khongsudung')}</p>
									) : (
										'---'
									)}
								</>
							),
						},
						{
							title: i18n.t('Common.Tacvu'),
							render: (data: ITeam) => (
								<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
									<IconCustom
										edit
										icon={<LuPencil fontSize={20} fontWeight={600} />}
										tooltip={i18n.t('Common.Chinhsua')}
										color='#777E90'
										href={`/team/chinh-sua?_id=${data.uuid}`}
									/>
									<IconCustom
										warn
										icon={data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />}
										tooltip={data.status === STATUS_GENERAL.SU_DUNG ? i18n.t('Common.khoa') : i18n.t('Common.mokhoa')}
										color='#777E90'
										onClick={() => setDataChangeStatus(data)}
									/>
								</div>
							),
						},
					]}
				/>
			</DataWrapper>
			<Pagination
				currentPage={Number(_page) || 1}
				pageSize={Number(_pageSize) || 20}
				total={pageListTeams?.data?.pagination?.totalCount}
				dependencies={[_pageSize, _keyword, _leaderUuid, _status]}
			/>

			{/* POPUP */}
			<Dialog
				warn
				open={!!dataChangeStatus}
				onClose={() => setDataChangeStatus(null)}
				title={i18n.t('Common.ThaydoiTrangthai')}
				note={i18n.t('Team.BancochacmuonchuyenTrangthai')}
				onSubmit={handleChangeStatusTeam}
			/>
		</div>
	);
}

export default MainTableTeam;
