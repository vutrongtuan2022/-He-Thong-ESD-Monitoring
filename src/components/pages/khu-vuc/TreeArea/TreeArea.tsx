import React, {Fragment, useState} from 'react';

import {PropsTreeArea} from './interfaces';
import styles from './TreeArea.module.scss';
import {IoMdAddCircle} from 'react-icons/io';
import {RiLoader4Fill} from 'react-icons/ri';
import {FaChromecast, FaMinusCircle, FaUser} from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import clsx from 'clsx';
import Link from 'next/link';
import {Eye, PictureFrame} from 'iconsax-react';
import {LuPencil} from 'react-icons/lu';
import {GrMap} from 'react-icons/gr';
import {HiOutlineUserGroup} from 'react-icons/hi';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';

function TreeArea({area, level}: PropsTreeArea) {
	const router = useRouter();

	const [open, setOpen] = useState<boolean>(false);

	const listTreeAreas = useQuery([QUERY_KEY.danh_sach_tree_khu_vuc, area?.uuid, open], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getTreeArea({
					uuid: area?.uuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!area?.uuid && open,
	});

	return (
		<Fragment>
			<div className={clsx(styles.container, {[styles.child]: level >= 1})}>
				{open ? (
					<div className={styles.add} onClick={() => setOpen(false)}>
						<FaMinusCircle size={18} color='#F95B5B' />
					</div>
				) : (
					<div
						className={clsx(styles.add, {[styles.disable]: area?.totalChildArea == 0})}
						onClick={() => {
							if (area?.totalChildArea == 0) {
								setOpen(false);
								return null;
							} else setOpen(true);
						}}
					>
						<IoMdAddCircle size={20} color='#2D74FF' />
					</div>
				)}
				<div className={styles.icon}>
					<GrMap size={20} color='#2D74FF' />
				</div>
				<p className={clsx(styles.name, {[styles.active]: open})}>
					{area?.code} - {area?.name}
				</p>
				<div className={styles.dash}></div>
				<Tippy content='Khu vực con'>
					<div className={styles.icon}>
						<PictureFrame size={19} color='#11B991' />
					</div>
				</Tippy>
				<p className={styles.totalTeam}>{area?.totalChildArea}</p>
				<div className={styles.dash}></div>
				<Tippy content='Tổng sổ team'>
					<div className={styles.icon}>
						<HiOutlineUserGroup size={22} color='#EB2E2E' />
					</div>
				</Tippy>
				<p className={styles.totalUser}>{area?.totalTeams}</p>
				<div className={styles.dash}></div>
				<Tippy content='Tổng nhân viên'>
					<div className={styles.icon}>
						<FaUser size={17} color='#4DBFDD' />
					</div>
				</Tippy>
				<p className={styles.totalUser}>{area?.totalUsers}</p>
				<div className={styles.dash}></div>
				<Tippy content='Tổng thiết bị'>
					<div className={styles.icon}>
						<FaChromecast size={18} color='#4DBFDD' />
					</div>
				</Tippy>
				<p className={styles.totalDevice}>{area?.totalDevices}</p>
				<div className={styles.line}></div>
				<Tippy content='Xem chi tiết'>
					<Link href={`/khu-vuc/${area?.uuid}`} className={styles.icon}>
						<Eye size={20} color='#777E90' />
					</Link>
				</Tippy>
				<div className={styles.line}></div>
				<Tippy content='Chỉnh sửa'>
					<div
						className={styles.icon}
						onClick={() =>
							router.replace(
								{
									pathname: PATH.Khuvuc,
									query: {
										...router.query,
										_open: 'update',
										_uuid: area.uuid,
									},
								},
								undefined,
								{
									scroll: false,
									shallow: false,
								}
							)
						}
					>
						<LuPencil size={20} color='#777E90' />
					</div>
				</Tippy>
			</div>

			{open && (
				<div className={clsx(styles.teamList)}>
					{listTreeAreas.isLoading ? (
						<div className={styles.loading}>
							<RiLoader4Fill size={24} color='#2D74FF' />
						</div>
					) : (
						<>
							{listTreeAreas.data?.map((v: any) => (
								<TreeArea key={v.uuid} area={v} level={level + 1} />
							))}
						</>
					)}
				</div>
			)}
		</Fragment>
	);
}

export default TreeArea;
