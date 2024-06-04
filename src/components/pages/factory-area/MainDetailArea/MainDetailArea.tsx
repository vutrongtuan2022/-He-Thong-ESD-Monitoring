import React, {useState} from 'react';

import {IDataDetailArea, PropsMainDetailArea} from './interfaces';
import styles from './MainDetailArea.module.scss';
import Loading from '~/components/common/Loading';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Dialog from '~/components/common/Dialog';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import TabNavLink from '~/components/common/TabNavLink';
import Moment from 'react-moment';
import Popup from '~/components/common/Popup';
import MainUpdateArea from '../MainUpdateArea';
import TableTeam from './components/TableTeam';
import TableChildArea from './components/TableChildArea';
import TableDevice from './components/TableDevice';
import i18n from '~/locale/i18n';

function MainDetailArea({}: PropsMainDetailArea) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _table, _open} = router.query;

	const [dataDetail, setDataDetail] = useState<IDataDetailArea>();
	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

	// GET DETAIL TEAM
	useQuery([QUERY_KEY.chi_tiet_khu_vuc, _id], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getDetail({
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
	const fucnChangeStatusArea = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.Changestatussuccessfully'),
				http: areaServices.changeStatusArea({
					uuid: dataDetail?.uuid!,
					status: dataDetail?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_khu_vuc, _id]);
			}
		},
	});

	const handleChangeStatusTeam = async () => {
		fucnChangeStatusArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatusArea.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: PATH.FactoryArea,
						title: i18n.t('Area.AreaList'),
					},
					{
						path: '',
						title: i18n.t('Area.AreaDetails'),
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
						<Link href={PATH.FactoryArea} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>{i18n.t('Area.RegionalInformation')}</p>
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
								onClick={() =>
									router.replace(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												_open: 'update',
												_uuid: dataDetail?.uuid,
											},
										},
										undefined,
										{
											scroll: false,
											shallow: false,
										}
									)
								}
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
									<span style={{marginRight: 6}}>{i18n.t('Area.AreaCode')}:</span>
									{dataDetail?.code}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.NumberOfSubareas')}: </span> {dataDetail?.totalChild}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.AreaName')}: </span> {dataDetail?.name}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.NumberOfTeams')}: </span>
									{dataDetail?.totalTeam}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.AreaParentName')}: </span> {dataDetail?.parentName}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.NumberofMember')}: </span>
									{dataDetail?.totalUser}
								</td>
							</tr>

							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.NumberofDevices')}: </span>
									{dataDetail?.totalDevice}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Common.Status')} : </span>
									<span style={{color: dataDetail?.status == STATUS_GENERAL.SU_DUNG ? '#2CAE39' : '#EB2E2E'}}>
										{dataDetail?.status == STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Use') : i18n.t('Common.Donotuse')}
									</span>
								</td>
							</tr>

							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Area.Createat')}: </span>
									<Moment date={dataDetail?.timeCreated} format='HH:mm, DD/MM/YYYY' />
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Common.Note')}: </span>
									{dataDetail?.notes || '---'}
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
								title: i18n.t('Area.ListOfSubareas'),
							},
							{
								pathname: router.pathname,
								query: 'list-team',
								title: i18n.t('Area.ListTeam'),
							},
							{
								pathname: router.pathname,
								query: 'bo-phat',
								title: i18n.t('Area.ListOfDevices'),
							},
						]}
					/>
					<div className={styles.main_table}>
						{!_table && <TableChildArea />}
						{_table == 'list-team' && <TableTeam />}
						{_table == 'bo-phat' && <TableDevice />}
					</div>
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Dialog
				warn
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={i18n.t('Common.Changestatus')}
				note={i18n.t('Area.DoyouwanttochangestatusArea')}
				onSubmit={handleChangeStatusTeam}
			/>

			<Popup
				open={_open == 'update'}
				onClose={() => {
					const {_open, _uuid, ...rest} = router.query;

					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{
							scroll: false,
							shallow: false,
						}
					);
				}}
			>
				<MainUpdateArea
					onClose={() => {
						const {_open, _uuid, ...rest} = router.query;

						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainDetailArea;
