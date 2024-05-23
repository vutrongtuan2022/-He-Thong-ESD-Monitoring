import React, {useState} from 'react';
import {PropsPageDetailUser} from './interfaces';
import styles from './PageDetailUser.module.scss';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';

import {PATH} from '~/constants/config';
import {HiDotsHorizontal} from 'react-icons/hi';
import clsx from 'clsx';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Avatar from '~/components/common/Avatar';
import {CiLock} from 'react-icons/ci';

const PageDetailUser = ({}: PropsPageDetailUser) => {
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
						path: PATH.NguoiDung,
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
						<Link href={PATH.NguoiDung} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>Vũ Văn A</p>
						</Link>

						<div className={styles.list_btn}>
							<div className={styles.btn_CiLock}>
								<CiLock color='#23262F' fontSize={16} fontWeight={600} />
								<p>Khóa lại</p>
							</div>
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
									<span>Mã nhân viên: </span>NV000078
								</td>
								<td>
									<span>Trạng thái: </span> Hoạt động
								</td>
							</tr>
							<tr>
								<td>
									<span>Chức vụ: </span> <span style={{color: 'var(--primary)'}}>Nhân viên</span>
								</td>
								<td>
									<span>Chức vụ: </span>Admin
								</td>
							</tr>
							<tr>
								<td>
									<span>Email: </span> <span style={{color: 'var(--primary)'}}>Lymacsau23@gmail.com</span>
								</td>
								<td>
									<span>Thuộc team:</span> N/A
								</td>
							</tr>
							<tr>
								<td>
									<span>Số điện thoại: </span>0978456789
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
									<span>Tạo lúc: </span>10/04/2024, 14:09:39
								</td>
							</tr>
							<tr>
								<td>
									<span>Địa chỉ: </span>SN 34, 12Tân Mai, Hoàng Mai, Hà Nội, Việt Nam
								</td>
								<td>
									<span>Cập nhật cuối: </span>10/04/2024, 14:09:39
								</td>
							</tr>
						</table>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default PageDetailUser;
