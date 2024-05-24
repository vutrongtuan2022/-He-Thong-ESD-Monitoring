import React, {useEffect, useState} from 'react';
import Status from '~/components/common/Status';
import {IUser, PropsListUser} from './interfaces';
import styles from './ListUser.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {LuCheck, LuPencil} from 'react-icons/lu';
import Button from '~/components/common/Button';
import HeadlessTippy from '@tippyjs/react/headless';
import Loading from '~/components/common/Loading';
import {Trash} from 'iconsax-react';
import {BsThreeDots} from 'react-icons/bs';
import Link from 'next/link';
import {AiOutlineUserAdd} from 'react-icons/ai';
import PopupCreate from '../PopupCreate';
import Popup from '~/components/common/Popup';
import Dialog from '~/components/common/Dialog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL, STATUS_USER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import clsx from 'clsx';
import {toastWarn} from '~/common/funcs/toast';
import IconCustom from '~/components/common/IconCustom';
import categoryServices from '~/services/categoryServices';

function ListUser({}: PropsListUser) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [file, setFile] = useState<any>(null);
	const {_page, _pageSize, _status, _username, _timeCreated, _keyword, _teamUuid} = router.query;
	const [dataChangeStatus, setDataChangeStatus] = useState<IUser | null>(null);
	const [OpenCreate, setOpenCreate] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [data, setData] = useState<any[]>([]);
	const [open, setOpen] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};

	const changeStatusDevice = useMutation({
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
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_nhan_vien, _page, _pageSize, _keyword, _status]);
			}
		},
	});

	const listUser = useQuery([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _keyword, _status, _teamUuid], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					username: _username ? (_username as string) : null,
					status: _status ? (_status as string) : null,
					timeCreated: null,
					teamUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUsers = useQuery([QUERY_KEY.dropdown_danh_sach_chuc_vu], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listRole({
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
					keyword: _keyword ? (_keyword as string) : '',
					status: STATUS_GENERAL.SU_DUNG,
					teamUuid: '',
					username: _username ? (_username as string) : '',
					timeCreated: {
						fromDate: _timeCreated ? new Date(Number(_timeCreated)).toISOString() : '',
						toDate: _timeCreated ? new Date(Number(_timeCreated)).toISOString() : '',
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
				http: userServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_bo_phat, _page, _pageSize, _keyword]);
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
			<div className={styles.control}>
				<div className={styles.left}>
					{data?.some((x) => x.isChecked !== false) && (
						<div>
							<Button className={styles.btn} rounded_8 w_fit icon={<LuCheck size={20} />}>
								Xác nhận xử lý
							</Button>
						</div>
					)}
					<div style={{minWidth: 360}}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhân viên, mã nhân viên' />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: STATUS_USER.HAVEACCOUNT,
									name: 'Có tài khoản',
								},
								{
									id: STATUS_USER.NOACCOUNT,
									name: 'Không có tài khoản',
								},
							]}
							name='Trạng thái'
							query='_username'
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							isSearch
							name='Chức vụ'
							query='_role'
							listFilter={listUsers?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
				<div></div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listUser?.data?.items}
					noti={<Noti des='Hiện tại chưa có bộ phát nào ?' />}
					loading={listUser?.isLoading}
				>
					<Table
						data={listUser?.data?.items}
						column={[
							{
								// checkBox: true,
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
								render: (data: IUser) => <p>{data.role || '---'}</p>,
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
											[styles.haveaccount]: data.userName !== '',
											[styles.noaccount]: data.userName === '',
										})}
									>
										{data.userName !== '' ? 'Đã cấp' : 'Chưa cấp'}
									</p>
								),
							},

							{
								title: 'Ngày tạo',
								render: (data: IUser) => <>{data.timeCreated || '---'}</>,
							},

							{
								title: 'Tác vụ',
								render: (data: IUser, index: number) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											create
											icon={<AiOutlineUserAdd size='22' />}
											tooltip='cấp account'
											color='#777E90'
											onClick={() => {
												setOpenCreate(true);
												setOpen(null);
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
											delete
											icon={<Trash size='22' />}
											tooltip='Thay đổi trạng thái'
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
					dependencies={[_pageSize, _keyword, _status]}
				/>
				<Dialog
					danger
					open={!!dataChangeStatus}
					onClose={() => setDataChangeStatus(null)}
					title='Đổi trạng thái'
					note='Bạn có chắc chắn muốn đổi trạng thái nhân viên này?'
					onSubmit={handleChangeStatusDevice}
				/>
			</div>
			<Popup open={OpenCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreate onClose={() => setOpenCreate(false)} />
			</Popup>
		</div>
	);
}

export default ListUser;
