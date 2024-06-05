import React, {useState} from 'react';

import {IDataDetailTeam, PropsMainDetailTeam} from './interfaces';
import styles from './MainDetailTeam.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import {useRouter} from 'next/router';
import TabNavLink from '~/components/common/TabNavLink';
import TableTeam from './components/TableTeam';
import TableUser from './components/TableUser';
import TableDevice from './components/TableDevice';
import TableHistory from './components/TableHistory';
import clsx from 'clsx';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function MainDetailTeam({}: PropsMainDetailTeam) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _table} = router.query;

	const [dataDetail, setDataDetail] = useState<IDataDetailTeam>();
	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

	// GET DETAIL TEAM
	useQuery([QUERY_KEY.chi_tiet_team, _id], {
		queryFn: () =>
			httpRequest({
				http: teamServices.detailTeam({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataDetail(data);
			}
		},
		enabled: !!_id,
	});

	// Đổi trạng thái team
	const fucnChangeStatusTeam = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.Changestatussuccessfully'),
				http: teamServices.changeStatusTeam({
					uuid: dataDetail?.uuid!,
					status: dataDetail?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_team, _id]);
			}
		},
	});

	const handleChangeStatusTeam = async () => {
		fucnChangeStatusTeam.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatusTeam.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: PATH.Team,
						title: i18n.t('Team.ListTeam'),
					},
					{
						path: '',
						title: i18n.t('Team.DetailTeam'),
					},
				]}
				action={
					<div className={styles.main_action}>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.main}>
					<div className={styles.header}>
						<Link href={PATH.Team} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>{i18n.t('Team.TeamInformation')}</p>
						</Link>
						<div className={styles.list_btn}>
							{dataDetail?.status == STATUS_GENERAL.SU_DUNG && (
								<Button
									className={styles.btn}
									rounded_8
									w_fit
									p_6_16
									danger_opacity
									bold
									onClick={() => setOpenChangeStatus(true)}
								>
									{i18n.t('Common.Lock')}
								</Button>
							)}

							{dataDetail?.status == STATUS_GENERAL.KHONG_SU_DUNG && (
								<Button className={styles.btn} rounded_8 w_fit p_6_16 green bold onClick={() => setOpenChangeStatus(true)}>
									{i18n.t('Common.Unlock')}
								</Button>
							)}

							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								blue_light
								bold
								href={`/team/update?_id=${dataDetail?.uuid}`}
							>
								{i18n.t('Common.Edit')}
							</Button>
						</div>
					</div>
					<div className={clsx('mt', styles.table)}>
						<table className={styles.containertable}>
							<colgroup>
								<col style={{width: '50%'}} />
								<col style={{width: '50%'}} />
							</colgroup>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.IDTeam')}:</span>
									{dataDetail?.code}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.TeamManager')}: </span>
									{dataDetail?.leaderName || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.TeamName')}: </span> {dataDetail?.name}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.IDManager')}: </span>
									{dataDetail?.leadCode || ''}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.ManagementArea')}: </span>
									{dataDetail?.areaName || ''}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.Belongtotheteam')}: </span>
									{dataDetail?.parentName || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.NumberofMember')}: </span>
									{dataDetail?.totalUser}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Common.Status')} : </span>
									<span style={{color: dataDetail?.status == STATUS_GENERAL.SU_DUNG ? '#2CAE39' : '#EB2E2E'}}>
										{dataDetail?.status == STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Using') : i18n.t('Common.Donotuse')}
									</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.NumberofDevices')}: </span>
									{dataDetail?.totalDevices}
								</td>
								<td rowSpan={3} className={styles.description}>
									<span style={{marginRight: 6}}>{i18n.t('Common.Note')}:</span>
									{dataDetail?.notes || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Team.TeamNumberDependent')}: </span>
									{dataDetail?.totalUnderTeam}
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div className={styles.main}>
					<TabNavLink
						outline
						query='_table'
						listHref={[
							{
								pathname: router.pathname,
								query: null,
								title: i18n.t('Team.ListTeamDependent'),
							},
							{
								pathname: router.pathname,
								query: 'nhan-vien',
								title: i18n.t('User.Listuser'),
							},
							{
								pathname: router.pathname,
								query: 'list-device',
								title: i18n.t('Team.ListDevice'),
							},
							{
								pathname: router.pathname,
								query: 'lich-su',
								title: i18n.t('Team.HistoryofNGDevice'),
							},
						]}
					/>

					<div className={styles.main_table}>
						{!_table && <TableTeam />}
						{_table == 'nhan-vien' && <TableUser />}
						{_table == 'list-device' && <TableDevice />}
						{_table == 'lich-su' && <TableHistory />}
					</div>
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Dialog
				warn
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={i18n.t('Common.Changestatus')}
				note={i18n.t('Common.Doyouwanttochangestatus')}
				onSubmit={handleChangeStatusTeam}
			/>
		</div>
	);
}

export default MainDetailTeam;
