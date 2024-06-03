import React, {useState} from 'react';

import {IDeviceDashboard, PropsListDeviceNG} from './interfaces';
import styles from './ListDeviceNG.module.scss';
import Search from '~/components/common/Search';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {LuCheck} from 'react-icons/lu';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';
import Moment from 'react-moment';
import {formatTimeHistory} from '~/common/funcs/optionConvert';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {RiLoader2Line} from 'react-icons/ri';
import i18n from '~/locale/i18n';

function ListDeviceNG({}: PropsListDeviceNG) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword} = router.query;

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [data, setData] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSubmit, setDataSubmit] = useState<any[]>([]);

	useQuery([QUERY_KEY.trang_chu_danh_sach_thiet_bi, _page, _pageSize, _keyword], {
		queryFn: () =>
			httpRequest({
				setLoading,
				http: dashboardServices.listDeviceNG({
					keyword: _keyword ? (_keyword as string) : '',
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					teamNames: null,
				}),
			}),
		onSuccess(data) {
			setData(
				data?.items?.map((v: any, index: number) => ({
					...v,
					index: index,
					isChecked: false,
				}))
			);
			setTotal(data?.pagination?.totalCount);
		},
	});

	const fucnCheckDeviceNG = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Overview.Successfully'),
				http: dashboardServices.checkDeviceNG({
					uuid: infoUser?.uuid!,
					deviceUuid: dataSubmit?.map((v) => v.deviceUuid),
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataSubmit([]);
				queryClient.invalidateQueries([QUERY_KEY.trang_chu_danh_sach_thiet_bi, _page, _pageSize, _keyword]);
			}
		},
	});

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: dashboardServices.exportExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					teamNames: null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	const handleSubmit = () => {
		if (!infoUser?.uuid) {
			return toastWarn({msg: i18n.t('Overview.UserNotFound')});
		}

		if (dataSubmit?.length == 0) {
			return toastWarn({msg: i18n.t('Overview.PleaseSelectTheProcessing')});
		}

		return fucnCheckDeviceNG.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnCheckDeviceNG.isLoading || exportExcel.isLoading} />

			<h4>
				{i18n.t('Overview.ListOfNGTransmitters')}({total})
			</h4>
			<div className={styles.control}>
				<div className={styles.left}>
					{data?.some((x) => x.isChecked !== false) && (
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								icon={<LuCheck size={20} />}
								onClick={() => setDataSubmit(data?.filter((v) => v.isChecked !== false))}
							>
								{i18n.t('Overview.ConfirmProcessing')}
							</Button>
						</div>
					)}
					<div style={{minWidth: 360}}>
						<Search keyName='_keyword' placeholder={i18n.t('Overview.SearchTransmitterID')} />
					</div>
				</div>
				<div>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_4_12
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
					data={data}
					loading={loading}
					noti={<Noti disableButton={true} des={i18n.t('Overview.CurrentlyNoTransmitters')} />}
				>
					<Table
						data={data}
						onSetData={setData}
						column={[
							{
								checkBox: true,
								title: i18n.t('Overview.STT'),
								render: (data: IDeviceDashboard, index: number) => <>{index + 1}</>,
							},
							{
								title: i18n.t('Overview.TeamName'),
								render: (data: IDeviceDashboard) => <>{data?.teamName || '---'}</>,
							},
							{
								title: i18n.t('Overview.TeamCode'),
								render: (data: IDeviceDashboard) => (
									<Link
										href={`/team/${data.teamUuid}`}
										className={styles.link}
										onClick={(e) => {
											!data.teamUuid && e.preventDefault();
										}}
									>
										{data?.teamCode || '---'}
									</Link>
								),
							},
							{
								title: i18n.t('Overview.IDTransmitter'),
								render: (data: IDeviceDashboard) => (
									<Link
										href={`/device/${data.deviceUuid}`}
										className={styles.link}
										onClick={(e) => {
											!data.deviceUuid && e.preventDefault();
										}}
									>
										{data?.macNumber || '---'}
									</Link>
								),
							},
							{
								title: i18n.t('Overview.PermanentValue'),
								render: (data: IDeviceDashboard) => <>{data?.edsStatic || '---'}</>,
							},
							{
								title: i18n.t('Overview.TimeDetection'),
								render: (data: IDeviceDashboard) => (
									<>
										<Moment date={data.timeNgStart} format='HH:mm, DD/MM/YYYY' />
									</>
								),
							},
							{
								title: i18n.t('Overview.TimeNG'),
								render: (data: IDeviceDashboard) => <>{formatTimeHistory(data.totalNgMinutes)}</>,
							},
							{
								title: i18n.t('Overview.Action'),
								render: (data: IDeviceDashboard) => (
									<>
										{!data?.qaUserUuid ? (
											<div>
												<Button
													p_4_8
													fz13
													rounded_4
													w_fit
													icon={<LuCheck size={14} />}
													onClick={() => setDataSubmit([data])}
												>
													{i18n.t('Overview.ConfirmProcessing')}
												</Button>
											</div>
										) : (
											<div className={styles.pending}>
												<RiLoader2Line size={20} />
												<p>{i18n.t('Overview.Processing')}</p>{' '}
											</div>
										)}
									</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={total}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword]}
				/>

				<Dialog
					open={dataSubmit?.length > 0}
					onClose={() => setDataSubmit([])}
					title={i18n.t('Overview.ConfirmProcessing')}
					note={i18n.t('Overview.AreYouSureProcessTheseDevices')}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
}

export default ListDeviceNG;
