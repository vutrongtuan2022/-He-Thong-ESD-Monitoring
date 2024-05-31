import React, {useState} from 'react';
import {IAccountDetail, PropsPageDetailAccount} from './interfaces';
import styles from './PageDetailAccount.module.scss';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';

import {PATH} from '~/constants/config';
import {HiDotsHorizontal} from 'react-icons/hi';
import clsx from 'clsx';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Avatar from '~/components/common/Avatar';
import {CiLock} from 'react-icons/ci';
import {toastWarn} from '~/common/funcs/toast';
import accountServices from '~/services/accountServices';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';
import Popup from '~/components/common/Popup';
import UpdateAccount from '../UpdateAccount';

const PageDetailAccount = ({}: PropsPageDetailAccount) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [dataDetailAccount, setDataDetailAccount] = useState<IAccountDetail>();
	const [dataChangeStatus, setDataChangeStatus] = useState<IAccountDetail | null>(null);
	const [openUpdate, setOpenUpdate] = useState<boolean>(false);

	useQuery([QUERY_KEY.chi_tiet_tai_khoan, _id], {
		queryFn: () =>
			httpRequest({
				http: accountServices.accountDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setDataDetailAccount(data);
		},
		enabled: !!_id,
	});

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
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_tai_khoan, _id]);
			}
		},
	});

	const handleChangeStatusAccount = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: i18n.t('Account.msg')});
		}
		return changeStatusAccount.mutate();
	};

	return (
		<div className={styles.containerPage}>
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Account.quanlytaikhoan'),
						path: PATH.TaiKhoan,
					},
					{
						title: i18n.t('Account.chitiettaikhoan'),
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<Loading loading={changeStatusAccount.isLoading} />
				<div className={styles.container}>
					<div className={styles.header}>
						<Link href={PATH.TaiKhoan} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>{i18n.t('Account.chitiettaikhoan')}</p>
						</Link>
						<div className={styles.list_btn}>
							{dataDetailAccount?.status == STATUS_GENERAL.SU_DUNG && (
								<Button
									className={styles.btn}
									rounded_8
									w_fit
									p_6_16
									danger_opacity
									bold
									onClick={() => setDataChangeStatus(dataDetailAccount)}
								>
									{i18n.t('Account.khoa')}
								</Button>
							)}

							{dataDetailAccount?.status == STATUS_GENERAL.KHONG_SU_DUNG && (
								<Button
									className={styles.btn}
									rounded_8
									w_fit
									p_6_16
									green
									bold
									onClick={() => setDataChangeStatus(dataDetailAccount)}
								>
									{i18n.t('Account.mokhoa')}
								</Button>
							)}
							<Button rounded_8 w_fit p_6_16 blue_light bold onClick={() => setOpenUpdate(true)}>
								{i18n.t('Account.Chinhsua')}
							</Button>
						</div>
					</div>

					<div className={clsx('mt', styles.table)}>
						<div className={'mb'}>
							<Avatar src={`${process.env.NEXT_PUBLIC_AVATAR}/${dataDetailAccount?.image}`} className={styles.avatar} />
						</div>
						<table className={styles.containertable}>
							<colgroup>
								<col style={{width: '50%'}} />
								<col style={{width: '50%'}} />
							</colgroup>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.manhanvien')}</span>
									{dataDetailAccount?.code || '---'}
								</td>
								<td>
									<span style={{marginRight: 6}}>
										{i18n.t('Account.Trangthai')}:{' '}
										<span>
											{dataDetailAccount?.status == STATUS_GENERAL.SU_DUNG ? (
												<span style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Account.Dangsudung')}</span>
											) : dataDetailAccount?.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
												<span style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Account.Khongsudung')}</span>
											) : (
												'---'
											)}
										</span>
									</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.chucvu')}: </span>{' '}
									<span>{dataDetailAccount?.regency || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.vaitro')}: </span>
									{dataDetailAccount?.roleName || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Email: </span> <span>{dataDetailAccount?.email || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.team')}:</span>{' '}
									<span>{dataDetailAccount?.teamName || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.sodienthoai')}: </span>
									{dataDetailAccount?.phone || '---'}
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.nguoiquanly')}:</span>{' '}
									<span>{dataDetailAccount?.teamLeader || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.ngaysinh')}: </span>
									<span>
										<Moment date={dataDetailAccount?.birthday} format='DD/MM/YYYY' />
									</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.nguoitao')}: </span>
									<span>{dataDetailAccount?.createdBy || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.diachi')}: </span>{' '}
									<span>{dataDetailAccount?.address || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>{i18n.t('Account.capnhat')}: </span>
									<span>
										{dataDetailAccount?.timeCreated ? (
											<Moment date={dataDetailAccount?.timeCreated} format='DD/MM/YYYY' />
										) : (
											'---'
										)}
									</span>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<Dialog
					warn
					open={!!dataChangeStatus}
					onClose={() => setDataChangeStatus(null)}
					title={i18n.t('Account.chuyen')}
					note={i18n.t('Account.chuyenTrangthai')}
					onSubmit={handleChangeStatusAccount}
				/>

				<Popup open={openUpdate} onClose={() => setOpenUpdate(false)}>
					<UpdateAccount dataUpdateAccount={dataDetailAccount as any} onClose={() => setOpenUpdate(false)} />
				</Popup>
			</WrapperContainer>
		</div>
	);
};

export default PageDetailAccount;
