import React from 'react';

import Image from 'next/image';

import {IDeviceNGHistory, PropsHistoryDevice} from './interfaces';
import styles from './HistoryDevice.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import {useRouter} from 'next/router';
import ngHistoryServices from '~/services/ngHistoryServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {formatTimeHistory} from '~/common/funcs/optionConvert';
import i18n from '~/locale/i18n';
import Loading from '~/components/common/Loading';
import Link from 'next/link';

function HistoryDevice({}: PropsHistoryDevice) {
	const router = useRouter();
	const {_id, _page, _pageSize, _keyword, _teamUuid} = router.query;

	// GET LIST DROPDOWN
	const listTeams = useQuery([QUERY_KEY.dropdown_danh_sach_team], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listTeam({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listHistoryDevices = useQuery([QUERY_KEY.lich_su_bo_phat_LG, _id, _page, _pageSize, _keyword, _teamUuid], {
		queryFn: () =>
			httpRequest({
				http: ngHistoryServices.listNGhistory({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					deviceUuid: _id as string,
					teamUuid: (_teamUuid as string) || null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: ngHistoryServices.exportExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					deviceUuid: _id as string,
					teamUuid: (_teamUuid as string) || null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading} />
			<h4>{i18n.t('Device.NgTransmitterHistory')}</h4>
			<div className={styles.flex}>
				<div className={styles.main_search}>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Team'
							query='_teamUuid'
							listFilter={listTeams?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
				<div>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_6_16
						green
						bold
						icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
						onClick={exportExcel.mutate}
					>
						Export excel
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listHistoryDevices?.data?.items}
					loading={listHistoryDevices.isLoading}
					noti={<Noti disableButton title={i18n.t('Device.EmptyList')} des={i18n.t('Device.EmptyTransmitterList')} />}
				>
					<Table
						data={listHistoryDevices?.data?.items}
						column={[
							{
								title: i18n.t('Common.No'),
								render: (data: IDeviceNGHistory, index: number) => <>{index + 1}</>,
							},
							{
								title: i18n.t('Team.IDTeam'),
								render: (data: IDeviceNGHistory) => (
									<Link href={`/team/${data.teamUuid}`} className={styles.link}>
										{data.teamCode}
									</Link>
								),
							},
							{
								title: i18n.t('Common.BelongToTeam'),
								render: (data: IDeviceNGHistory) => <>{data.teamName || '---'}</>,
							},
							{
								title: i18n.t('Device.LeaderTeam'),
								render: (data: IDeviceNGHistory) => <>{data.teamLeader || '---'}</>,
							},
							{
								title: i18n.t('Device.NgDetectionTime'),
								render: (data: IDeviceNGHistory) => <Moment date={data.timeNgStart} format='HH:mm, DD/MM/YYYY' />,
							},
							{
								title: i18n.t('Device.NgDuration'),
								render: (data: IDeviceNGHistory) => <>{formatTimeHistory(data.totalNgMinutes || 0)}</>,
							},
							{
								title: i18n.t('Device.ElectrostaticValue'),
								render: (data: IDeviceNGHistory) => <>{data.edsStatic || '---'}</>,
							},
						]}
					/>
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 20}
						total={listHistoryDevices?.data?.pagination?.totalCount}
						dependencies={[_pageSize, _keyword, _teamUuid]}
					/>
				</DataWrapper>
			</div>
		</div>
	);
}

export default HistoryDevice;
