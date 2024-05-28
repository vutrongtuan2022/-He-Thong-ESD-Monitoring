import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import {IUser, PropsMainPageUser} from './interfaces';
import styles from './MainPageUser.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import Image from 'next/image';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {QUERY_KEY, STATUS_ACCOUNT, STATUS_GENERAL} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import {toastWarn} from '~/common/funcs/toast';
import Popup from '~/components/common/Popup';
import PopupCreate from '../PopupCreateAccount';
import Dialog from '~/components/common/Dialog';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {Lock1, Unlock, UserCirlceAdd} from 'iconsax-react';
import DataWrapper from '~/components/common/DataWrapper';
import {LuPencil} from 'react-icons/lu';
import clsx from 'clsx';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import Link from 'next/link';
import Loading from '~/components/common/Loading';
import Moment from 'react-moment';
import ImportExcel from '~/components/common/ImportExcel';
import i18n from '~/locale/i18n';

function MainPageUser({}: PropsMainPageUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _status, _isHaveAcc, _username, importExcel, _keyword, _regency} = router.query;

	const [file, setFile] = useState<any>(null);
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [dataChangeStatus, setDataChangeStatus] = useState<IUser | null>(null);

	const changeStatusUser = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi trạng thái thành công!',
				http: userServices.updateUserStatus({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _keyword, _status, _isHaveAcc]);
			}
		},
	});

	const listUser = useQuery([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _regency, _keyword, _status, _isHaveAcc], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: _keyword ? (_keyword as string) : '',
					username: _username ? (_username as string) : null,
					status: _status ? (_status as string) : null,
					timeCreated: null,
					teamUuid: '',
					isHaveAcc: _isHaveAcc ? (_isHaveAcc as string) : null,
					regencyUuid: _regency ? (_regency as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listRegencys = useQuery([QUERY_KEY.dropdown_danh_sach_chuc_vu], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listRegency({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: userServices.exportExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: (_keyword as string) || '',
					status: _status as string,
					isHaveAcc: _isHaveAcc as string,
					teamUuid: null,
					timeCreated: null,
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
				http: userServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_nhan_vien, _page, _pageSize, _keyword]);
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
			return toastWarn({msg: 'Không tìm thấy nhân viên!'});
		}

		return changeStatusUser.mutate();
	};

	const handleExportExcel = async () => {
		exportExcel.mutate();
	};

	const handleImportExcel = async () => {
		fucnImportExcel.mutate();
	};
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.home'),
					},
					{
						path: '',
						title: 'Danh sách nhân viên',
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
								href={PATH.ThemNhanvien}
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
				<Loading loading={changeStatusUser.isLoading || exportExcel.isLoading || fucnImportExcel.isLoading} />
				<div className={styles.container}>
					<div className={styles.control}>
						<div className={styles.left}>
							<div style={{minWidth: 360}}>
								<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhân viên, mã nhân viên' />
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									name='Tài khoản'
									query='_isHaveAcc'
									listFilter={[
										{
											id: STATUS_ACCOUNT.HAVEACCOUNT,
											name: 'Đã cấp tài khoản',
										},
										{
											id: STATUS_ACCOUNT.NOACCOUNT,
											name: 'Chưa cấp tài khoản',
										},
									]}
								/>
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									isSearch
									name='Chức vụ'
									query='_regency'
									listFilter={listRegencys?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.name,
									}))}
								/>
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									name='Trạng thái'
									query='_status'
									listFilter={[
										{
											id: STATUS_GENERAL.SU_DUNG,
											name: 'Sử dụng',
										},
										{
											id: STATUS_GENERAL.KHONG_SU_DUNG,
											name: 'Không sử dụng',
										},
									]}
								/>
							</div>
						</div>
						<div></div>
					</div>
					<div className={styles.table}>
						<DataWrapper
							data={listUser?.data?.items}
							noti={<Noti des='Hiện tại chưa có nhân viên nào ?' />}
							loading={listUser?.isLoading}
						>
							<Table
								data={listUser?.data?.items}
								column={[
									{
										title: 'STT',
										render: (data: IUser, index: number) => <>{index + 1}</>,
									},

									{
										title: 'Mã nhân viên',
										render: (data: IUser) => (
											<Link href={`/nhan-vien/${data.uuid}`} className={styles.link}>
												{data.code || '---'}
											</Link>
										),
									},
									{
										title: 'Tên nhân viên',
										render: (data: IUser) => <p>{data.fullname}</p>,
									},
									{
										title: 'Chức vụ',
										render: (data: IUser) => <p>{data.regency || '---'}</p>,
									},
									{
										title: 'Thuộc team',
										render: (data: IUser) => <p>{data.teamName || '---'}</p>,
									},
									{
										title: 'Leader team',
										render: (data: IUser) => <>{data.leadName || '---'}</>,
									},
									{
										title: 'Tài khoản',
										render: (data: IUser) => (
											<p
												className={clsx(styles.status, {
													[styles.haveaccount]: data.userName,
													[styles.noaccount]: !data.userName,
												})}
											>
												{data.userName ? data.userName : 'Chưa cấp'}
											</p>
										),
									},

									{
										title: 'Trạng thái',
										render: (data: IUser) => (
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
										title: 'Ngày tạo',
										render: (data: IUser) => <Moment date={data.timeCreated} format='HH:mm, DD/MM/YYYY' />,
									},

									{
										title: 'Tác vụ',
										render: (data: IUser) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													create
													icon={<UserCirlceAdd size='23' />}
													tooltip='Thêm tài khoản'
													color='#777E90'
													onClick={() => {
														setOpenCreate(true);
													}}
												/>

												<IconCustom
													edit
													icon={<LuPencil fontSize={20} fontWeight={600} />}
													tooltip='Chỉnh sửa'
													color='#777E90'
													onClick={() => {
														router.push(`/nhan-vien/chinh-sua?_id=${data.uuid}`);
													}}
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
							total={listUser?.data?.pagination?.totalCount}
							pageSize={Number(_pageSize) || 20}
							dependencies={[_username, _pageSize, _keyword, _status]}
						/>

						<Dialog
							warn
							open={!!dataChangeStatus}
							onClose={() => setDataChangeStatus(null)}
							title='Chuyển trạng thái'
							note='Bạn có chắc chắn chuyển trạng thái cho nhân viên này?'
							onSubmit={handleChangeStatusDevice}
						/>
					</div>
					<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
						<PopupCreate onClose={() => setOpenCreate(false)} />
					</Popup>
					<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
						<ImportExcel
							name='file-user'
							file={file}
							pathTemplate='/static/files/Mau_Import_Device.xlsx'
							setFile={setFile}
							onClose={handleCloseImportExcel}
							onSubmit={handleImportExcel}
						/>
					</Popup>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageUser;
