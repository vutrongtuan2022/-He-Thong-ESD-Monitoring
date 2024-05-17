import React, {useEffect, useState} from 'react';

import {PropsTableInfor} from './interfaces';
import styles from './TableInfor.module.scss';

import {useRouter} from 'next/router';
import {LuCheck, LuPencil} from 'react-icons/lu';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import {PATH} from '~/constants/config';

function TableInfor({}: PropsTableInfor) {
	const router = useRouter();

	const {_page, _pageSize, _keyword} = router.query;
	const [data, setData] = useState<any[]>([]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link href={PATH.Gateway} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Thông tin gateway</p>
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
							<span>ID thiết bị: </span>8f7d6s6s8
						</td>
						<td>
							<span>Trạng thái: </span> Online
						</td>
					</tr>
					<tr>
						<td>
							<span>Tên gateway: </span> Gate way khu M
						</td>
						<td>
							<span>Online lần cuối: </span> N/A
						</td>
					</tr>
					<tr>
						<td>
							<span>Số thiết bị phát đang kết nối:</span>30
						</td>
						<td rowSpan={4} className={styles.description}>
							<span>Ghi chú:</span>
							--
						</td>
					</tr>
					<tr>
						<td>
							<span>IP đang kết nối: </span>192.168.1.1
						</td>
					</tr>
				</table>
			</div>
		</div>
	);
}

export default TableInfor;
