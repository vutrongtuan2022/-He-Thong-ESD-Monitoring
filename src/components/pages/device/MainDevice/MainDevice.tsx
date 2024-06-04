import React, {useEffect, useState} from 'react';
import Image from 'next/image';

import {IDevice, PropsMainDevice} from './interfaces';
import styles from './MainDevice.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Lock1, Unlock} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Popup from '~/components/common/Popup';
import FormCreateTransmitter from '../FormCreateDevice';
import FormUpdateTransmitter from '../FormUpdateDevice';
import Link from 'next/link';
import {QUERY_KEY, STATE_DEVICE_NG, STATE_GATEWAY, STATE_ONLINE_DEVICE, STATUS_GENERAL, TYPE_BATTERY} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import StateDevice from '../StateDevice';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import ImportExcel from '~/components/common/ImportExcel';
import Noti from '~/components/common/DataWrapper/components/Noti';
import i18n from '~/locale/i18n';
import {getBatteryCapacity} from '~/common/funcs/optionConvert';

function MainDevice({}: PropsMainDevice) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _pin, _onlineState, _status, _ngState, importExcel} = router.query;

	const [file, setFile] = useState<any>(null);
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [dataUpdate, setDataUpdate] = useState<IDevice | null>(null);
	const [dataChangeStatus, setDataChangeStatus] = useState<IDevice | null>(null);

	// Lấy danh sách thiết bị
	const listDevices = useQuery([QUERY_KEY.danh_sach_bo_phat, _page, _pageSize, _keyword, _pin, _onlineState, _status, _ngState], {
		queryFn: () =>
			httpRequest({
				http: deviceServices.listDevice({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					onlineState: _onlineState ? Number(_onlineState) : null,
					ngState: _ngState ? Number(_ngState) : null,
					status: _status ? Number(_status) : null,
					battery: {
						toDouble: getBatteryCapacity(Number(_pin)).toDouble,
						fromDouble: getBatteryCapacity(Number(_pin)).fromDouble,
					},
					edS_Static: null,
					gatewayUuid: null,
					teamUuid: null,
					factoryAreaUuid: null,
					timeLastOnline: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Đổi trạng thái thiết bị
	const changeStatusDevice = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Device.TransmitterAddedSuccessfully'),
				http: deviceServices.updateDeviceStatus({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([
					QUERY_KEY.danh_sach_bo_phat,
					_page,
					_pageSize,
					_keyword,
					_pin,
					_onlineState,
					_status,
					_ngState,
				]);
			}
		},
	});

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: deviceServices.exportExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					onlineState: _onlineState ? Number(_onlineState) : null,
					ngState: _ngState ? Number(_ngState) : null,
					status: _status ? Number(_status) : null,
					battery: {
						toDouble: getBatteryCapacity(Number(_pin)).toDouble,
						fromDouble: getBatteryCapacity(Number(_pin)).fromDouble,
					},
					edS_Static: null,
					gatewayUuid: null,
					teamUuid: null,
					factoryAreaUuid: null,
					timeLastOnline: null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	// Func import excel
	const fucnImportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.FileImportedSuccessfully'),
				http: deviceServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([
					QUERY_KEY.danh_sach_bo_phat,
					_page,
					_pageSize,
					_keyword,
					_pin,
					_onlineState,
					_status,
					_ngState,
				]);
			}
		},
	});

	// Close popup import excel
	const handleCloseImportExcel = () => {
		const {importExcel, ...rest} = router.query;

		setFile(null);
		router.replace(
			{
				query: rest,
			},
			undefined,
			{scroll: false}
		);
	};

	const handleChangeStatusDevice = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: i18n.t('Device.msg')});
		}

		return changeStatusDevice.mutate();
	};

	const handleExportExcel = async () => {
		exportExcel.mutate();
	};

	const handleImportExcel = async () => {
		fucnImportExcel.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={changeStatusDevice.isLoading || exportExcel.isLoading || fucnImportExcel.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.Home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Device.TransmitterManagement'),
						path: '',
					},
				]}
				action={
					<div className={styles.main_action}>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								green
								bold
								icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
								onClick={handleExportExcel}
							>
								Export excel
							</Button>
						</div>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								blue_light
								bold
								icon={<Image alt='icon import' src={icons.import_excel} width={20} height={20} />}
								onClick={() =>
									router.replace(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												importExcel: 'open',
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
								Import excel
							</Button>
						</div>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								primary
								bold
								icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
								onClick={() => setOpenCreate(true)}
							>
								{i18n.t('Device.AddNew')}
							</Button>
						</div>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.main}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search keyName='_keyword' placeholder={i18n.t('Device.SearchByMacAddressDeviceName')} />
						</div>

						<div className={styles.filter}>
							<FilterCustom
								name='Pin'
								query='_pin'
								listFilter={[
									{id: TYPE_BATTERY['> 80%'], name: 'Trên 80%'},
									{id: TYPE_BATTERY['50% - 80%'], name: '50% - 80%'},
									{id: TYPE_BATTERY['20% - 50%'], name: '20% - 50%'},
									{id: TYPE_BATTERY['< 20%'], name: 'Dưới 20%'},
								]}
							/>
						</div>

						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.Active')}
								query='_onlineState'
								listFilter={[
									{id: STATE_ONLINE_DEVICE.ONLINE, name: 'Online'},
									{id: STATE_ONLINE_DEVICE.OFFLINE, name: 'Offline'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.Status')}
								query='_status'
								listFilter={[
									{id: STATUS_GENERAL.SU_DUNG, name: i18n.t('Device.InUse')},
									{id: STATUS_GENERAL.KHONG_SU_DUNG, name: i18n.t('Device.NotInUse')},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.Condition')}
								query='_ngState'
								listFilter={[
									{id: STATE_DEVICE_NG.KHONG_NG, name: i18n.t('Device.Normal')},
									{id: STATE_DEVICE_NG.BI_NG, name: i18n.t('Device.NotGood')},
								]}
							/>
						</div>
					</div>
					<div className={styles.table}>
						<DataWrapper
							data={listDevices?.data?.items}
							loading={listDevices.isLoading}
							noti={
								<Noti
									title={i18n.t('Device.EmptyTransmitter')}
									des={i18n.t('Device.EmptyTransmitterList')}
									titleButton={i18n.t('Device.AddNewTransmitter')}
									onClick={() => setOpenCreate(true)}
								/>
							}
						>
							<Table
								data={listDevices?.data?.items}
								column={[
									{
										title: i18n.t('Common.No'),
										render: (data: IDevice, index: number) => <>{index + 1}</>,
									},
									{
										title: i18n.t('Common.MACNumber'),
										render: (data: IDevice) => (
											<Link href={`/device/${data.uuid}`} className={styles.link}>
												{data.macNumber}
											</Link>
										),
									},
									{
										title: i18n.t('Device.DeviceName'),
										render: (data: IDevice) => <>{data.name}</>,
									},
									{
										title: i18n.t('Common.BelongToTeam'),
										render: (data: IDevice) => <>{data.teamName || '---'}</>,
									},
									{
										title: i18n.t('Device.LeaderTeam'),
										render: (data: IDevice) => <>{data.teamLeaderName || '---'}</>,
									},
									{
										title: i18n.t('Device.BatteryPercentage'),
										render: (data: IDevice) => <>{data.battery}%</>,
									},
									{
										title: i18n.t('Common.Active'),
										// render: (data: IDevice) => <StateDevice status={data.state} />,
										render: (data: IDevice) => (
											<>
												{data?.ngStatus == STATE_GATEWAY.ONLINE ? (
													<p style={{color: '#35C244', fontWeight: 600}}>Online</p>
												) : data.ngStatus == STATE_GATEWAY.OFFLINE ? (
													<p style={{color: '#E85A5A', fontWeight: 600}}>Offline</p>
												) : (
													'---'
												)}
											</>
										),
									},

									{
										title: i18n.t('Common.Status'),
										render: (data: IDevice) => (
											<>
												{data?.status == STATUS_GENERAL.SU_DUNG ? (
													<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Device.InUse')}</p>
												) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
													<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Device.NotInUse')}</p>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: i18n.t('Device.Condition'),
										render: (data: IDevice) => (
											<>
												{data?.ngStatus == STATE_DEVICE_NG.KHONG_NG ? (
													<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Device.Normal')}</p>
												) : data.ngStatus == STATE_DEVICE_NG.BI_NG ? (
													<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Device.NotGood')}</p>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: i18n.t('Gateway.LastOnline'),
										render: (data: IDevice) =>
											data.timeLastOnline ? <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' /> : '---',
									},
									{
										title: i18n.t('Common.Action'),
										render: (data: IDevice) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													edit
													icon={<LuPencil fontSize={20} fontWeight={600} />}
													tooltip={i18n.t('Device.Edit')}
													color='#777E90'
													onClick={() => setDataUpdate(data)}
												/>

												<IconCustom
													warn
													icon={
														data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />
													}
													tooltip={
														data.status === STATUS_GENERAL.SU_DUNG
															? i18n.t('Common.Lock')
															: i18n.t('Common.Unlock')
													}
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
							total={listDevices?.data?.pagination?.totalCount}
							dependencies={[_pageSize, _keyword, _pin, _onlineState, _status, _ngState]}
						/>
					</div>
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Dialog
				warn
				open={!!dataChangeStatus}
				onClose={() => setDataChangeStatus(null)}
				title={i18n.t('Common.Changestatus')}
				note={i18n.t('Device.AreYouSureYouWantToChangeTheStatusOfThisTransmitter')}
				onSubmit={handleChangeStatusDevice}
			/>
			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<FormCreateTransmitter onClose={() => setOpenCreate(false)} />
			</Popup>
			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<FormUpdateTransmitter dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
			<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-device'
					file={file}
					pathTemplate='/static/files/Mau_Import_Device.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={handleImportExcel}
				/>
			</Popup>
		</div>
	);
}

export default MainDevice;
