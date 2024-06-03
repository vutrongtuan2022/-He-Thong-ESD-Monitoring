import React, {useState} from 'react';
import {Lock1, Unlock} from 'iconsax-react';

import {IArea, PropsTableArea} from './interfaces';
import styles from './TableArea.module.scss';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import Loading from '~/components/common/Loading';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import {PATH} from '~/constants/config';
import MainUpdateArea from '../MainUpdateArea';
import i18n from '~/locale/i18n';

function TableArea({}: PropsTableArea) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status, _open} = router.query;

	const [dataChangeStatus, setDataChangeStatus] = useState<IArea | null>(null);

	const pageListAreas = useQuery([QUERY_KEY.danh_sach_khu_vuc, _page, _pageSize, _keyword, _status], {
		queryFn: () =>
			httpRequest({
				http: areaServices.listArea({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: _status ? Number(_status) : null,
					parentUuid: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Đổi trạng thái team
	const fucnChangeStatusArea = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.Changestatussuccessfully'),
				http: areaServices.changeStatusArea({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_khu_vuc, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	const handleChangeStatusArea = async () => {
		fucnChangeStatusArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnChangeStatusArea.isLoading} />
			<DataWrapper
				data={pageListAreas?.data?.items}
				loading={pageListAreas.isLoading}
				noti={<Noti title={i18n.t('Area.EmptyAreas')} des={i18n.t('Area.AreaListIsEmpty')} />}
			>
				<Table
					data={pageListAreas?.data?.items}
					column={[
						{
							title: i18n.t('Common.STT'),
							render: (data: IArea, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Area.AreaCode'),
							render: (data: IArea) => (
								<Link href={`/factory-area/${data.uuid}`} className={styles.link}>
									{data.code || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Area.AreaName'),
							render: (data: IArea) => <>{data.name}</>,
						},
						{
							title: i18n.t('Area.NumberOfSubareas'),
							render: (data: IArea) => <>{data.totalChild}</>,
						},
						{
							title: i18n.t('Area.NumberOfTeams'),
							render: (data: IArea) => <>{data.totalTeam}</>,
						},
						{
							title: i18n.t('Area.NumberofMember'),
							render: (data: IArea) => <>{data.totalUser || 0}</>,
						},
						{
							title: i18n.t('Area.NumberofDevices'),
							render: (data: IArea) => <>{data.totalDevice}</>,
						},
						{
							title: i18n.t('Area.AreaFather'),
							render: (data: IArea) => <>{data.parentName || '---'}</>,
						},
						{
							title: i18n.t('Common.Status'),
							render: (data: IArea) => (
								<>
									{data?.status == STATUS_GENERAL.SU_DUNG ? (
										<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Common.Using')}</p>
									) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
										<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Common.Donotuse')}</p>
									) : (
										'---'
									)}
								</>
							),
						},
						{
							title: i18n.t('Common.Action'),
							render: (data: IArea) => (
								<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
									<IconCustom
										edit
										icon={<LuPencil fontSize={20} fontWeight={600} />}
										tooltip={i18n.t('Common.Edit')}
										color='#777E90'
										onClick={() =>
											router.replace(
												{
													pathname: PATH.FactoryArea,
													query: {
														...router.query,
														_open: 'update',
														_uuid: data.uuid,
													},
												},
												undefined,
												{
													scroll: false,
													shallow: false,
												}
											)
										}
									/>

									<IconCustom
										warn
										icon={data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />}
										tooltip={data.status === STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Lock') : i18n.t('Common.UnLock')}
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
				total={pageListAreas?.data?.pagination?.totalCount}
				dependencies={[_pageSize, _keyword, _status]}
			/>

			{/* POPUP */}
			<Dialog
				warn
				open={!!dataChangeStatus}
				onClose={() => setDataChangeStatus(null)}
				title={i18n.t('Common.Changestatus')}
				note={i18n.t('Area.DoyouwanttochangestatusArea')}
				onSubmit={handleChangeStatusArea}
			/>

			{/* POPUP */}
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

export default TableArea;
