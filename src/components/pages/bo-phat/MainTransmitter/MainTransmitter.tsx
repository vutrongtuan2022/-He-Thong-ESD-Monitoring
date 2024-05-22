import React, {useState} from 'react';
import Image from 'next/image';

import {IDevice, PropsMainTransmitter} from './interfaces';
import styles from './MainTransmitter.module.scss';
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
import {Trash} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Popup from '~/components/common/Popup';
import FormCreateTransmitter from '../FormCreateTransmitter';
import FormUpdateTransmitter from '../FormUpdateTransmitter';
import Link from 'next/link';
import {QUERY_KEY, STATE_DEVICE_NG, STATE_ONLINE_DEVICE, STATUS_DEVICE} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import StatusDevice from '../StatusDevice';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import clsx from 'clsx';
import ImportExcel from '~/components/common/ImportExcel';
import Noti from '~/components/common/DataWrapper/components/Noti';

function MainTransmitter({}: PropsMainTransmitter) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _pin, _onlineState, _ngState, _status, importExcel} = router.query;

	const [file, setFile] = useState<any>(null);
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [dataUpdate, setDataUpdate] = useState<IDevice | null>(null);
	const [dataChangeStatus, setDataChangeStatus] = useState<IDevice | null>(null);

	// Lấy danh sách thiết bị
	const listDevices = useQuery([QUERY_KEY.danh_sach_bo_phat, _page, _pageSize, _keyword, _pin, _onlineState, _ngState, _status], {
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
					factoryAreaUuid: '',
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
				msgSuccess: 'Thay đổi trạng thái thành công!',
				http: deviceServices.updateDeviceStatus({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_DEVICE.SU_DUNG ? STATUS_DEVICE.KHONG_SU_DUNG : STATUS_DEVICE.SU_DUNG,
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
					_ngState,
					_status,
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
				msgSuccess: 'Import file thành công!',
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
					_ngState,
					_status,
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
			return toastWarn({msg: 'Không tìm thấy thiết bị!'});
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
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý bộ phát',
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
								Thêm mới
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
							<Search keyName='_keyword' placeholder='Tìm kiếm theo số MAC, tên thiết bị' />
						</div>
						<div className={styles.filter}>
							<Search isNumber keyName='_pin' placeholder='Tìm kiếm phần trăm pin' />
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name='Trạng thái'
								query='_status'
								listFilter={[
									{id: STATUS_DEVICE.SU_DUNG, name: 'Hoạt động'},
									{id: STATUS_DEVICE.KHONG_SU_DUNG, name: 'Không hoạt động'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name='Hoạt động'
								query='_onlineState'
								listFilter={[
									{id: STATE_ONLINE_DEVICE.ONLINE, name: 'Online'},
									{id: STATE_ONLINE_DEVICE.OFFLINE, name: 'Offline'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name='Trạng thái NG'
								query='_ngState'
								listFilter={[
									{id: STATE_DEVICE_NG.KHONG_NG, name: 'Bình thường'},
									{id: STATE_DEVICE_NG.BI_NG, name: 'Not good'},
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
									title='Bộ phát trống'
									des='Danh sách bộ phát trống!'
									titleButton='Thêm mới bộ phát'
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
										title: 'Trạng thái',
										render: (data: IDevice) => (
											<p
												className={clsx(styles.status, {
													[styles.sudung]: data.status == STATUS_DEVICE.SU_DUNG,
													[styles.khongsudung]: data.status == STATUS_DEVICE.KHONG_SU_DUNG,
												})}
											>
												{data.status == STATUS_DEVICE.SU_DUNG ? 'Đang sử dụng' : 'Không sử dụng'}
											</p>
										),
									},
									{
										title: 'Hoạt động',
										render: (data: IDevice) => <StatusDevice status={data.state} />,
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
													delete
													icon={<Trash size='22' />}
													tooltip='Xóa'
													color='#777E90'
													onClick={() => setDataChangeStatus(data)}
												/>
											</div>
										),
									},
								]}
							/>
							<Pagination
								currentPage={Number(_page) || 1}
								total={listDevices?.data?.pagination?.totalCount}
								pageSize={Number(_pageSize) || 20}
								dependencies={[_pageSize, _keyword, _pin, _onlineState, _ngState, _status]}
							/>
						</DataWrapper>
					</div>
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Dialog
				danger
				open={!!dataChangeStatus}
				onClose={() => setDataChangeStatus(null)}
				title='Đổi trạng thái'
				note='Bạn có chắc chắn muốn đổi trạng thái bộ phát này?'
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

export default MainTransmitter;
