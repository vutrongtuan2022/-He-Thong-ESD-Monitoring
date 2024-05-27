import React, {Fragment, useEffect, useState} from 'react';
import {IUserDetail, PropsInfoUser} from './interfaces';
import styles from './InfoUser.module.scss';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import {httpRequest} from '~/services';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import userServices from '~/services/userServices';
import {PATH} from '~/constants/config';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import Dialog from '~/components/common/Dialog';
import {toastWarn} from '~/common/funcs/toast';
import Moment from 'react-moment';
import Loading from '~/components/common/Loading';

function InfoUser({}: PropsInfoUser) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [data, setData] = useState<IUserDetail>();
	const [dataChangeStatus, setDataChangeStatus] = useState<IUserDetail | null>(null);

	useQuery([QUERY_KEY.chi_tiet_nhan_vien, _id], {
		queryFn: () =>
			httpRequest({
				http: userServices.userDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setData(data);
		},
		enabled: !!_id,
	});

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
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nhan_vien, _id]);
			}
		},
	});

	const handleChangeStatusUser = async () => {
		if (!dataChangeStatus?.uuid) {
			return toastWarn({msg: 'Không tìm thấy nhân viên!'});
		}
		return changeStatusUser.mutate();
	};

	return (
		<Fragment>
			<Loading loading={changeStatusUser.isLoading} />
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.NhanVien} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>Chi tiết nhân viên</p>
					</Link>
					<div className={styles.list_btn}>
						{data?.status == STATUS_GENERAL.SU_DUNG && (
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								danger_opacity
								bold
								onClick={() => setDataChangeStatus(data)}
							>
								Khóa
							</Button>
						)}

						{data?.status == STATUS_GENERAL.KHONG_SU_DUNG && (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 green bold onClick={() => setDataChangeStatus(data)}>
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
								router.push(`/nhan-vien/chinh-sua?_id=${_id}`);
							}}
						>
							Chỉnh sửa
						</Button>
					</div>
				</div>
				<div className={clsx('mt', styles.table)}>
					<table className={styles.containertable}>
						<colgroup>
							<col style={{width: '50%'}} />
							<col style={{width: '50%'}} />
						</colgroup>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Mã nhân viên: </span> {data?.code || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Chức vụ: </span> {data?.regency || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Họ và tên: </span> {data?.fullname || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Thuộc team: : </span> {data?.teamName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Email: </span> {data?.email || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Leader team: </span> {data?.leadName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Số điện thoại: </span> {data?.phone || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Tạo lúc: </span>{' '}
								<Moment date={data?.timeCreated} format='HH:mm, DD/MM/YYYY' />,
							</td>
						</tr>
						{/* <tr>
						<td>
							<span style={{marginRight: 6}}>Số CCCD: </span>
						</td>
						<td>
							<span style={{marginRight: 6}}>Cập nhập lần cuối: </span>
						</td>
					</tr> */}
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
		</Fragment>
	);
}

export default InfoUser;
