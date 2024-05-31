import React, {useState} from 'react';
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
import {QUERY_KEY, STATE_DEVICE_NG, STATE_ONLINE_DEVICE, STATUS_GENERAL} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import StateDevice from '../StateDevice';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import ImportExcel from '~/components/common/ImportExcel';
import Noti from '~/components/common/DataWrapper/components/Noti';
import i18n from '~/locale/i18n';

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
						toDouble: _pin && Number(_pin) < 100 ? Number(_pin) : 100,
						fromDouble: 0,
					},
					edS_Static: null,
					gatewayUuid: '',
					teamUuid: '',
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
				msgSuccess: i18n.t('Device.msgSuccess'),
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
					status: STATUS_GENERAL.SU_DUNG,
					battery: {
						toDouble: _pin && Number(_pin) < 100 ? Number(_pin) : 100,
						fromDouble: 0,
					},
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
				msgSuccess: i18n.t('Device.importfilethanhcong'),
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
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Device.quanlybophat'),
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
								{i18n.t('Device.themmoi')}
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
							<Search keyName='_keyword' placeholder={i18n.t('Device.timkiem')} />
						</div>
						<div className={styles.filter}>
							<Search isNumber keyName='_pin' placeholder={i18n.t('Device.timkiempin')} />
						</div>

						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.hoatdong')}
								query='_onlineState'
								listFilter={[
									{id: STATE_ONLINE_DEVICE.ONLINE, name: 'Online'},
									{id: STATE_ONLINE_DEVICE.OFFLINE, name: 'Offline'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.Trangthai')}
								query='_status'
								listFilter={[
									{id: STATUS_GENERAL.SU_DUNG, name: 'Sử dụng'},
									{id: STATUS_GENERAL.KHONG_SU_DUNG, name: 'Không sử dụng'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Device.tinhtrang')}
								query='_ngState'
								listFilter={[
									{id: STATE_DEVICE_NG.KHONG_NG, name: i18n.t('Device.binhthuong')},
									{id: STATE_DEVICE_NG.BI_NG, name: i18n.t('Device.bing')},
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
									title={i18n.t('Device.bophattrong')}
									des={i18n.t('Device.danhsachbophattrong')}
									titleButton={i18n.t('Device.themmoibophat')}
									onClick={() => setOpenCreate(true)}
								/>
							}
						>
							<Table
								data={listDevices?.data?.items}
								column={[
									{
										title: 'STT',
										render: (data: IDevice, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Số MAC',
										render: (data: IDevice) => (
											<Link href={`/bo-phat/${data.uuid}`} className={styles.link}>
												{data.macNumber}
											</Link>
										),
									},
									{
										title: 'Tên thiết bị',
										render: (data: IDevice) => <>{data.name}</>,
									},
									{
										title: 'Thuộc team',
										render: (data: IDevice) => <>{data.teamName || '---'}</>,
									},
									{
										title: 'Leader team',
										render: (data: IDevice) => <>{data.teamLeaderName || '---'}</>,
									},
									{
										title: 'Phần trăm pin',
										render: (data: IDevice) => <>{data.battery}%</>,
									},
									{
										title: 'Hoạt động',
										render: (data: IDevice) => <StateDevice status={data.state} />,
									},
									{
										title: 'Tình trạng',
										render: (data: IDevice) => (
											<>
												{data?.ngStatus == STATE_DEVICE_NG.KHONG_NG ? (
													<p style={{color: '#35C244', fontWeight: 600}}>Bình thường</p>
												) : data.ngStatus == STATE_DEVICE_NG.BI_NG ? (
													<p style={{color: '#E85A5A', fontWeight: 600}}>Not good</p>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Trạng thái',
										render: (data: IDevice) => (
											<>
												{data?.status == STATUS_GENERAL.SU_DUNG ? (
													<p style={{color: '#35C244', fontWeight: 600}}>Đang sử dụng</p>
												) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
													<p style={{color: '#E85A5A', fontWeight: 600}}>Không sử dụng</p>
												) : (
													'---'
												)}
											</>
										),
									},
									{
										title: 'Online lần cuối',
										render: (data: IDevice) => <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' />,
									},
									{
										title: 'Tác vụ',
										render: (data: IDevice) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													edit
													icon={<LuPencil fontSize={20} fontWeight={600} />}
													tooltip='Chỉnh sửa'
													color='#777E90'
													onClick={() => setDataUpdate(data)}
												/>

												<IconCustom
													warn
													icon={
														data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />
													}
													tooltip={data.status === STATUS_GENERAL.SU_DUNG ? 'Khóa' : 'Mở khóa'}
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
				title='Thay đổi trạng thái'
				note='Bạn có chắc chắn muốn thay đổi trạng thái bộ phát này?'
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
