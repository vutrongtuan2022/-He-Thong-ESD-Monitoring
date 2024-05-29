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

const PageDetailAccount = ({}: PropsPageDetailAccount) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [dataDetailAccount, setDataDetailAccount] = useState<IAccountDetail>();

	const [dataChangeStatus, setDataChangeStatus] = useState<IAccountDetail | null>(null);

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
				msgSuccess: 'Thay đổi trạng thái thành công!',
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
			return toastWarn({msg: 'Không tìm thấy tài khoản!'});
		}
		return changeStatusAccount.mutate();
	};

	return (
		<div className={styles.containerPage}>
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
					{
						title: 'Chi tiết tài khoản',
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
							<p>Chi tiết tài khoản</p>
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
									Khóa
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
									Mở khóa
								</Button>
							)}
							<Button
								rounded_8
								w_fit
								p_6_16
								blue_light
								bold
								onClick={() => {
									router.push(`/tai-khoan/chinh-sua?_id=${_id}`);
								}}
							>
								Chỉnh sửa
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
									<span style={{marginRight: 6}}>Mã nhân viên: </span>
									{dataDetailAccount?.code || '---'}
								</td>
								<td>
									<span style={{marginRight: 6}}>
										Trạng thái:{' '}
										<span>
											{dataDetailAccount?.status == STATUS_GENERAL.SU_DUNG ? (
												<span style={{color: '#35C244', fontWeight: 600}}>Đang sử dụng</span>
											) : dataDetailAccount?.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
												<span style={{color: '#E85A5A', fontWeight: 600}}>Không sử dụng</span>
											) : (
												'---'
											)}
										</span>
									</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Chức vụ: </span> <span>{dataDetailAccount?.regency || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>Vai trò: </span>
									{dataDetailAccount?.roleName || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Email: </span> <span>{dataDetailAccount?.email || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>Thuộc team:</span> <span>{dataDetailAccount?.teamName || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Số điện thoại: </span>
									{dataDetailAccount?.phone || '---'}
								</td>
								<td>
									<span style={{marginRight: 6}}>Người quản lý:</span>{' '}
									<span>{dataDetailAccount?.teamLeader || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Ngày sinh: </span>
									<span>
										<Moment date={dataDetailAccount?.birthday} format='DD/MM/YYYY' />
									</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>Người tạo: </span>
									<span>{dataDetailAccount?.createdBy || '---'}</span>
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Địa chỉ: </span> <span>{dataDetailAccount?.address || '---'}</span>
								</td>
								<td>
									<span style={{marginRight: 6}}>Cập nhật cuối: </span>
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
					title='Chuyển trạng thái'
					note='Bạn có chắc chắn chuyển trạng thái cho tài khoản này?'
					onSubmit={handleChangeStatusAccount}
				/>
			</WrapperContainer>
		</div>
	);
};

export default PageDetailAccount;
