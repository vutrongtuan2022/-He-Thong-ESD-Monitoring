import React, {useState} from 'react';
import {IAccount, PropsMainPageAccount} from './interfaces';
import styles from './MainPageAccount.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {BsThreeDots} from 'react-icons/bs';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import clsx from 'clsx';
import Table from '~/components/common/Table';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Status from '~/components/common/Status';
import HeadlessTippy from '@tippyjs/react/headless';
import {LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';
import {Lock} from 'iconsax-react';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import IconCustom from '~/components/common/IconCustom';
import StateAccount from '../StateAccount';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import {QUERY_KEY, STATUS_ACCOUNT, STATUS_GENERAL} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import {toastWarn} from '~/common/funcs/toast';
import Noti from '~/components/common/DataWrapper/components/Noti';

const MainPageAccount = ({}: PropsMainPageAccount) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_page, _pageSize, _status, _isHaveAcc, _username, importExcel, _keyword, _position, _roleUuid} = router.query;
	const [openClock, setOpenClock] = useState<IAccount | null>(null);
	const changeStatusUser = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi trạng thái thành công!',
				http: accountServices.updateAccountStatus({
					uuid: openClock?.uuid!,
					status: openClock?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenClock(null);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_tai_khoan, _page, _roleUuid, _username, _pageSize, _keyword, _status]);
			}
		},
	});
	const listAccount = useQuery([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _keyword, _status, _isHaveAcc], {
		queryFn: () =>
			httpRequest({
				http: accountServices.listAccount({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: _keyword ? (_keyword as string) : '',
					roleUuid: _username ? (_username as string) : '',
					status: _status ? (_status as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});
	const listPosition = useQuery([QUERY_KEY.dropdown_danh_sach_chuc_vu], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listPosition({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const handleChangeStatusDevice = async () => {
		if (!openClock?.uuid) {
			return toastWarn({msg: 'Không tìm thấy tài khoản!'});
		}

		return changeStatusUser.mutate();
	};

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý tài khoản',
						path: PATH.TaiKhoan,
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
							>
								Export excel
							</Button>
						</div>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search placeholder='Tìm kiếm theo mã người dùng, tên người dùng' keyName='_keyword' />
						</div>
						<div style={{minWidth: 240}}>
							<FilterCustom
								isSearch
								name='Chức vụ'
								query='_position'
								listFilter={listPosition?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Trạng thái'
								query='_status'
								listFilter={[
									{
										id: STATUS_GENERAL.SU_DUNG,
										name: 'Hoạt động',
									},
									{
										id: STATUS_GENERAL.KHONG_SU_DUNG,
										name: 'Đang khóa',
									},
								]}
							/>
						</div>
					</div>
				</div>
				<div className={styles.table}>
					<DataWrapper
						data={listAccount?.data?.items}
						noti={<Noti des='Hiện tại chưa có tài khoản nào ?' />}
						loading={listAccount?.isLoading}
					>
						<Table
							data={listAccount?.data?.items}
							column={[
								{
									title: 'STT',
									render: (data: IAccount, index: number) => <>{index + 1}</>,
								},
								{
									title: 'Mã người dùng',
									render: (data: IAccount) => (
										<Link href={`/tai-khoan/${data.uuid}`} className={styles.DetailUser}>
											{data.code || '---'}
										</Link>
									),
								},
								{
									title: 'Tên người dùng',
									render: (data: IAccount) => <p>{data.fullName}</p>,
								},
								{
									title: 'Email',
									render: (data: IAccount) => <p>{data.email}</p>,
								},
								{
									title: 'Số điện thoại',
									render: (data: IAccount) => <p>{data.phone}</p>,
								},
								{
									title: 'Chức vụ',
									render: (data: IAccount) => <p>{data.regency}</p>,
								},
								{
									title: 'Vai trò',
									render: (data: IAccount) => <>{data.roleUuid || '---'}</>,
								},
								{
									title: 'Trạng thái',
									render: (data: IAccount) => (
										<>
											{data?.status == STATUS_GENERAL.SU_DUNG ? (
												<p style={{color: '#35C244', fontWeight: 600}}>Hoạt động</p>
											) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
												<p style={{color: '#E85A5A', fontWeight: 600}}>Đang khóa</p>
											) : (
												'---'
											)}
										</>
									),
								},
								{
									title: '',
									render: (data: IAccount) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											<IconCustom
												warn
												icon={<Lock fontSize={20} fontWeight={600} />}
												tooltip=' Khóa '
												color='#777E90'
												onClick={() => setOpenClock(data)}
											/>
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip='Chỉnh sửa'
												color='#777E90'
												onClick={() => {
													router.push(`/tai-khoan/chinh-sua?_id=${data.uuid}`);
												}}
											/>
										</div>
									),
								},
							]}
						/>
					</DataWrapper>
					<Pagination
						currentPage={Number(_page) || 1}
						total={listAccount?.data?.pagination?.totalCount}
						pageSize={Number(_pageSize) || 20}
						dependencies={[_pageSize, _keyword, _username, _status]}
					/>
					<Dialog
						warn
						open={!!openClock}
						onClose={() => setOpenClock(null)}
						title='Khóa Người Dùng'
						note='Bạn có chắc chắn muốn khóa người dùng này?'
						onSubmit={handleChangeStatusDevice}
					/>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default MainPageAccount;
