import React, {Fragment, useState} from 'react';
import Image from 'next/image';
import {PropsInfoTransmitter} from './interfaces';
import styles from './InfoTransmitter.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Dialog from '~/components/common/Dialog';

function InfoTransmitter({}: PropsInfoTransmitter) {
	const [openCancel, setOpenCancel] = useState<boolean>(false);

	const handleCancel = () => {};

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.BoPhat} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>Thông tin bộ phát</p>
					</Link>
					<div className={styles.list_btn}>
						<Button
							className={styles.btn}
							rounded_8
							w_fit
							p_6_16
							danger_opacity
							bold
							icon={<Image alt='icon import' src={icons.icon_warn} width={20} height={20} />}
							onClick={() => setOpenCancel(true)}
						>
							Hủy quyền sử dụng
						</Button>
					</div>
				</div>
				<div className={'mt'}>
					<table className={styles.containertable}>
						<colgroup>
							<col style={{width: '50%'}} />
							<col style={{width: '50%'}} />
						</colgroup>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Số MAC thiết bị: </span>8f7d6s6s8
							</td>
							<td>
								<span style={{marginRight: 6}}>Thuộc team: </span> Team của Dương Minh Nghĩa
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Tên thiết bị: </span> Bộ phát số 3
							</td>
							<td>
								<span style={{marginRight: 6}}>Mã team: </span> 244122412
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Giá trị tĩnh điện hiện tại:</span> 8^4
							</td>
							<td>
								<span style={{marginRight: 6}}>Leader team: </span> Dương Minh Nghĩa
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Phần trăm pin: </span> 30%
							</td>
							<td rowSpan={5} className={styles.description}>
								<span style={{marginRight: 6}}>Ghi chú:</span>
								--
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Gateway đang kết nối: </span>45223232
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Trạng thái sóng: </span>Trung bình
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Trạng thái hoạt động: </span>Online
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Tình trạng: </span>NG
							</td>
						</tr>
					</table>
				</div>
			</div>

			{/* POPUP */}
			<Dialog
				danger
				open={openCancel}
				onClose={() => setOpenCancel(false)}
				title='Hủy quyền sử dụng'
				note='Bạn có muốn hủy quyền sử dụng bộ phát này không?'
				onSubmit={handleCancel}
			/>
		</Fragment>
	);
}

export default InfoTransmitter;
