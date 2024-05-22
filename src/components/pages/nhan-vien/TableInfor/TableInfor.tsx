import React, {useEffect, useState} from 'react';
import {IUserDetail, PropsTableInfor} from './interfaces';
import styles from './TableInfor.module.scss';
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
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';

function TableInfor({}: PropsTableInfor) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const {_page, _pageSize, _keyword} = router.query;
	const [data, setData] = useState<IUserDetail>();

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
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link href={PATH.NhanVien} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết nhân viên</p>
				</Link>
				<div className={styles.list_btn}>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_6_16
						danger_opacity
						bold
						icon={<Image alt='icon trash' src={icons.icon_trash} width={20} height={20} />}
					>
						Xóa bỏ
					</Button>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_6_16
						blue_light
						bold
						icon={<Image alt='icon import' src={icons.icon_note} width={20} height={20} />}
					>
						Chỉnh sửa
					</Button>
				</div>
			</div>
			<div className={clsx('mt')}>
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
							<span style={{marginRight: 6}}>Chức vụ: </span> {data?.role || '---'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: 6}}>Họ và tên: </span> {data?.fullname || '---'}
						</td>
						<td>
							<span style={{marginRight: 6}}>Thuộc team: : </span> {data?.teamName ? `Team ${data?.teamName}` : '---'}
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
							<span style={{marginRight: 6}}>Tạo lúc: </span> {data?.timeCreated || '---'}
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
		</div>
	);
}

export default TableInfor;
