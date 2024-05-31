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
import CreateAccountFromUser from '../CreateAccountFromUser';
import Dialog from '~/components/common/Dialog';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import {Lock1, TickCircle, Unlock, UserCirlceAdd} from 'iconsax-react';
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
	const [dataChangeStatus, setDataChangeStatus] = useState<IUser | null>(null);
	const [dataCreateAccount, setDataCreateAccount] = useState<IUser | null>(null);

	const changeStatusUser = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.ThaydoiTrangthaithanhcong'),
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
				msgSuccess: i18n.t('Common.Importfilethanhcong'),
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
			return toastWarn({msg: i18n.t('User.Khongtimthaynhanvien')});
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
						title: i18n.t('User.danhsachnhanvien'),
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
								{i18n.t('Common.Themmoi')}
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
								<Search keyName='_keyword' placeholder={i18n.t('User.Timkiemtheotennhanvienmanhanvien')} />
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									name={i18n.t('Common.Taikhoan')}
									query='_isHaveAcc'
									listFilter={[
										{
											id: STATUS_ACCOUNT.HAVEACCOUNT,
											name: i18n.t('Common.Dacaptaikhoan'),
										},
										{
											id: STATUS_ACCOUNT.NOACCOUNT,
											name: i18n.t('Common.Chuacaptaikhoan'),
										},
									]}
								/>
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									isSearch
									name={i18n.t('Common.Chucvu')}
									query='_regency'
									listFilter={listRegencys?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.name,
									}))}
								/>
							</div>
							<div style={{minWidth: 240}}>
								<FilterCustom
									name={i18n.t('Common.Trangthai')}
									query='_status'
									listFilter={[
										{
											id: STATUS_GENERAL.SU_DUNG,
											name: i18n.t('Common.Sudung'),
										},
										{
											id: STATUS_GENERAL.KHONG_SU_DUNG,
											name: i18n.t('Common.Khongsudung'),
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
							noti={<Noti des={i18n.t('User.Hientaichuaconhanviennao')} />}
							loading={listUser?.isLoading}
						>
							<Table
								data={listUser?.data?.items}
								column={[
									{
										title: i18n.t('Common.STT'),
										render: (data: IUser, index: number) => <>{index + 1}</>,
									},

									{
										title: i18n.t('Common.Manhanvien'),
										render: (data: IUser) => (
											<Link href={`/nhan-vien/${data.uuid}`} className={styles.link}>
												{data.code || '---'}
											</Link>
										),
									},
									{
										title: i18n.t('Common.Tennhanvien'),
										render: (data: IUser) => <p>{data.fullname}</p>,
									},
									{
										title: i18n.t('Common.Chucvu'),
										render: (data: IUser) => <p>{data.regency || '---'}</p>,
									},
									{
										title: i18n.t('Common.Thuocteam'),
										render: (data: IUser) => <p>{data.teamName || '---'}</p>,
									},
									{
										title: 'Leader team',
										render: (data: IUser) => <>{data.leadName || '---'}</>,
									},
									{
										title: i18n.t('Common.Taikhoan'),
										render: (data: IUser) => (
											<p
												className={clsx(styles.status, {
													[styles.haveaccount]: data.userName,
													[styles.noaccount]: !data.userName,
												})}
											>
												{data.userName ? data.userName : i18n.t('Common.Chuacap')}
											</p>
										),
									},

									{
										title: i18n.t('User.Trangthai'),
										render: (data: IUser) => (
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
										title: i18n.t('Common.Ngaytao'),
										render: (data: IUser) => <Moment date={data.timeCreated} format='HH:mm, DD/MM/YYYY' />,
									},

									{
										title: i18n.t('Common.Tacvu'),
										render: (data: IUser) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												{!data?.userName ? (
													<IconCustom
														create
														icon={<UserCirlceAdd size='23' />}
														tooltip={i18n.t('User.Themtaikhoan')}
														color='#777E90'
														onClick={() => {
															setDataCreateAccount(data);
														}}
													/>
												) : (
													<IconCustom
														create
														icon={<TickCircle size='23' />}
														tooltip={i18n.t('Common.Dacap')}
														color='#35c244'
													/>
												)}

												<IconCustom
													edit
													icon={<LuPencil fontSize={20} fontWeight={600} />}
													tooltip={i18n.t('Common.Chinhsua')}
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
													tooltip={
														data.status === STATUS_GENERAL.SU_DUNG
															? i18n.t('Common.Khoa')
															: i18n.t('Common.Mokhoa')
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
							total={listUser?.data?.pagination?.totalCount}
							pageSize={Number(_pageSize) || 20}
							dependencies={[_username, _pageSize, _keyword, _status]}
						/>

						<Dialog
							warn
							open={!!dataChangeStatus}
							onClose={() => setDataChangeStatus(null)}
							title={i18n.t('Common.ChuyenTrangthai')}
							note={i18n.t('Common.BancochacmuonchuyenTrangthai')}
							onSubmit={handleChangeStatusDevice}
						/>
					</div>
					<Popup open={!!dataCreateAccount} onClose={() => setDataCreateAccount(null)}>
						<CreateAccountFromUser dataCreateAccount={dataCreateAccount} onClose={() => setDataCreateAccount(null)} />
					</Popup>
					<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
						<ImportExcel
							name='file-user'
							file={file}
							pathTemplate='/static/files/Mau_Import_User.xlsx'
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
