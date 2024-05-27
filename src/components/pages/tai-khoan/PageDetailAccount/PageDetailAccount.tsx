import React, {useState} from 'react';
import {IAccDetail, PropsPageDetailAccount} from './interfaces';
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

const PageDetailAccount = ({}: PropsPageDetailAccount) => {
	const router = useRouter();
	const {_id} = router.query;
	const [data, setData] = useState<IAccDetail>();
	const [dataChangeStatus, setDataChangeStatus] = useState<IAccDetail | null>(null);
	const queryClient = useQueryClient();
	const changeStatusUser = useMutation({
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
	useQuery([QUERY_KEY.chi_tiet_nhan_vien, _id], {
		queryFn: () =>
			httpRequest({
				http: accountServices.accountDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setData(data);
		},
		enabled: !!_id,
	});

	const handleChangeStatusUser = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: 'Không tìm thấy taif khoan!'});
		}
		return changeStatusUser.mutate();
	};

	const handleLockButtonClick = () => {
		if (!data) return;
		setDataChangeStatus(data);
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
				<div className={styles.main_page}>
					<div className={styles.header}>
						<Link href={PATH.TaiKhoan} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>Chi tiết nhân viên</p>
						</Link>

						<div className={styles.list_btn}>
							<Button
								rounded_8
								w_fit
								p_6_16
								danger_opacity={data?.status === STATUS_GENERAL.SU_DUNG}
								green_opacity={data?.status !== STATUS_GENERAL.SU_DUNG}
								bold
								onClick={handleLockButtonClick}
							>
								{data?.status === STATUS_GENERAL.SU_DUNG ? 'Khóa lại' : 'Mở khóa'}
							</Button>
							<div className={styles.btn_HiDots}>
								<HiDotsHorizontal color='#23262F' fontSize={20} fontWeight={1000} />
							</div>
						</div>
					</div>
					<Avatar src={''} className={styles.avatar} />
					<div className={clsx('mt')}>
						<table className={styles.container}>
							<colgroup>
								<col style={{width: '50%'}} />
								<col style={{width: '50%'}} />
							</colgroup>
							<tr>
								<td>
									<span>Mã nhân viên: </span>
									{data?.code || '---'}
								</td>
								<td>
									<span>Trạng thái: </span>
									<span>
										{data?.status === STATUS_GENERAL.SU_DUNG ? (
											<p style={{color: '#35C244', fontWeight: 600}}>Hoạt động</p>
										) : data?.status === STATUS_GENERAL.KHONG_SU_DUNG ? (
											<p style={{color: '#E85A5A', fontWeight: 600}}>Đang khóa</p>
										) : (
											'---'
										)}
									</span>
								</td>
							</tr>
							<tr>
								<td>
									<span>Chức vụ: </span> <span style={{color: 'var(--primary)'}}>{data?.regency || '---'}</span>
								</td>
								<td>
									<span>Vai trò: </span>
									{data?.roleUuid || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span>Email: </span> <span style={{color: 'var(--primary)'}}>{data?.email || '---'}</span>
								</td>
								<td>
									<span>Thuộc team:</span> N/A
								</td>
							</tr>
							<tr>
								<td>
									<span>Số điện thoại: </span>
									{data?.phone || '---'}
								</td>
								<td>
									<span>Người quản lý:</span> Nguyễn Dương
								</td>
							</tr>
							<tr>
								<td>
									<span>Ngày sinh: </span>08/08/1992
								</td>
								<td>
									<span>Người tạo: </span>
									Minh Vũ
								</td>
							</tr>
							<tr>
								<td>
									<span>Số căn cước: </span>1434234231
								</td>
								<td>
									<span>Tạo lúc: </span>
									{data?.birthday || '---'}
								</td>
							</tr>
							<tr>
								<td>
									<span>Địa chỉ: </span>SN 34, 12Tân Mai, Hoàng Mai, Hà Nội, Việt Nam
								</td>
								<td>
									<span>Cập nhật cuối: </span>
									{data?.timeCreated || '---'}
								</td>
							</tr>
						</table>
					</div>
					<Dialog
						warn
						open={!!dataChangeStatus}
						onClose={() => setDataChangeStatus(null)}
						title='Chuyển trạng thái'
						note='Bạn có chắc chắn chuyển trạng thái cho nhân viên này?'
						onSubmit={handleChangeStatusUser}
					/>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default PageDetailAccount;
