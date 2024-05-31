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
import Table from '~/components/common/Table';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import {LuPencil} from 'react-icons/lu';
import {Eye, Lock1, Unlock} from 'iconsax-react';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import IconCustom from '~/components/common/IconCustom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import {toastWarn} from '~/common/funcs/toast';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Loading from '~/components/common/Loading';
import ImageFill from '~/components/common/ImageFill';
import Popup from '~/components/common/Popup';
import UpdateAccount from '../UpdateAccount';
import i18n from '~/locale/i18n';

const MainPageAccount = ({}: PropsMainPageAccount) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _status, _keyword, _roleUuid} = router.query;

	const [dataChangeStatus, setDataChangeStatus] = useState<IAccount | null>(null);
	const [dataUpdateAccount, setDataUpdateAccount] = useState<IAccount | null>(null);

	const changeStatusAccount = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Account.msgSuccess'),
				http: accountServices.updateAccountStatus({
					uuid: dataChangeStatus?.uuid!,
					status: dataChangeStatus?.status! == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeStatus(null);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_tai_khoan, _page, _pageSize, _status, _keyword, _roleUuid]);
			}
		},
	});

	const listRoles = useQuery([QUERY_KEY.dropdown_danh_sach_role], {
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

	const listAccount = useQuery([QUERY_KEY.danh_sach_tai_khoan, _page, _pageSize, _status, _keyword, _roleUuid], {
		queryFn: () =>
			httpRequest({
				http: accountServices.listAccount({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					roleUuid: _roleUuid ? (_roleUuid as string) : null,
					status: _status ? Number(_status) : null,
					// roleName:_roleName ? (_roleName as string) : null

				}),
			}),
		select(data) {
			return data;
		},
	});

	const handleChangeStatusDevice = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: i18n.t('Account.msg')});
		}
		return changeStatusAccount.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={changeStatusAccount.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Account.quanlytaikhoan'),
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
							<Search placeholder={i18n.t('Account.timkiem')} keyName='_keyword' />
						</div>
						<div style={{minWidth: 240}}>
							<FilterCustom
								isSearch
								name={i18n.t('Account.vaitro')}
								query='_roleUuid'
								listFilter={listRoles?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								name={i18n.t('Account.Trangthai')}
								query='_status'
								listFilter={[
									{
										id: STATUS_GENERAL.SU_DUNG,
										name: i18n.t('Account.Sudung'),
									},
									{
										id: STATUS_GENERAL.KHONG_SU_DUNG,
										name: i18n.t('Account.Khongsudung'),
									},
								]}
							/>
						</div>
					</div>
				</div>
				<div className={styles.table}>
					<DataWrapper
						data={listAccount?.data?.items}
						noti={<Noti des={i18n.t('Account.hientai')} />}
						loading={listAccount?.isLoading}
					>
						<Table
							data={listAccount?.data?.items}
							column={[
								{
									title: i18n.t('Account.STT'),
									render: (data: any, index: number) => <>{index + 1}</>,
								},
								{
									title: i18n.t('Account.manhanvien'),
									render: (data: IAccount) => (
										<Link href={`/nhan-vien/${data?.userUuid}`} className={styles.link}>
											{data?.code || '---'}
										</Link>
									),
								},
								{
									title: i18n.t('Account.tennhanvien'),
									render: (data: IAccount) => (
										<div className={styles.info}>
											<ImageFill
												src={`${process.env.NEXT_PUBLIC_AVATAR}/${data?.image}`}
												alt='avatar'
												className={styles.image}
											/>
											<p>{data?.fullName || '---'}</p>
										</div>
									),
								},
								{
									title: 'Email',
									render: (data: IAccount) => <p>{data?.email || '---'}</p>,
								},
								{
									title: i18n.t('Account.sodienthoai'),
									render: (data: IAccount) => <p>{data?.phone || '---'}</p>,
								},
								{
									title: i18n.t('Account.chucvu'),
									render: (data: IAccount) => <p>{data?.regency || '---'}</p>,
								},
								{
									title: i18n.t('Account.vaitro'),
									render: (data: IAccount) => <>{data?.roleName || '---'}</>,
								},
								{
									title: i18n.t('Account.Trangthai'),
									render: (data: IAccount) => (
										<>
											{data?.status == STATUS_GENERAL.SU_DUNG ? (
												<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Account.Dangsudung')}</p>
											) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
												<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Account.Khongsudung')}</p>
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
												create
												icon={<Eye fontSize={20} fontWeight={600} />}
												tooltip={i18n.t('Account.chitiet')}
												color='#777E90'
												href={`/tai-khoan/${data?.uuid}`}
											/>
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip={i18n.t('Account.Chinhsua')}
												color='#777E90'
												onClick={() => setDataUpdateAccount(data)}
											/>
											<IconCustom
												warn
												icon={data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />}
												tooltip={
													data.status === STATUS_GENERAL.SU_DUNG
														? i18n.t('Account.khoa')
														: i18n.t('Account.mokhoa')
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
						total={listAccount?.data?.pagination?.totalCount}
						pageSize={Number(_pageSize) || 20}
						dependencies={[_pageSize, _status, _keyword, _roleUuid]}
					/>
					<Dialog
						warn
						open={!!dataChangeStatus}
						onClose={() => setDataChangeStatus(null)}
						title={i18n.t('Account.khoataikhoa')}
						note={i18n.t('Account.bancochac')}
						onSubmit={handleChangeStatusDevice}
					/>
				</div>
			</WrapperContainer>

			<Popup open={!!dataUpdateAccount} onClose={() => setDataUpdateAccount(null)}>
				<UpdateAccount dataUpdateAccount={dataUpdateAccount} onClose={() => setDataUpdateAccount(null)} />
			</Popup>
		</div>
	);
};

export default MainPageAccount;
