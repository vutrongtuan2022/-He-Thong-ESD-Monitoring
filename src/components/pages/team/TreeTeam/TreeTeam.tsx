import React, {Fragment, useState} from 'react';

import {PropsTreeTeam} from './interfaces';
import styles from './TreeTeam.module.scss';
import {IoMdAddCircle} from 'react-icons/io';
import {RiLoader4Fill, RiShieldUserLine} from 'react-icons/ri';
import {FaUserGroup} from 'react-icons/fa6';
import {GiPerson} from 'react-icons/gi';
import {FaChromecast, FaMinusCircle} from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import clsx from 'clsx';
import Link from 'next/link';
import {Eye} from 'iconsax-react';
import {LuPencil} from 'react-icons/lu';
import i18n from '~/locale/i18n';

function TreeTeam({team, level}: PropsTreeTeam) {
	const [open, setOpen] = useState<boolean>(false);

	const listTreeTeams = useQuery([QUERY_KEY.danh_sach_tree_team, team.uuid, open], {
		queryFn: () =>
			httpRequest({
				http: teamServices.listTeamTree({
					uuid: team.uuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!team?.uuid && open,
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
						className={clsx(styles.add, {[styles.disable]: team?.totalSubTeams == 0})}
						onClick={() => {
							if (team?.totalSubTeams == 0) {
								setOpen(false);
								return null;
							} else setOpen(true);
						}}
					>
						<IoMdAddCircle size={20} color='#2D74FF' />
					</div>
				)}
				<div className={styles.icon}>
					<RiShieldUserLine size={20} color='#2D74FF' />
				</div>
				<p className={clsx(styles.name, {[styles.active]: open})}>
					{team?.name} - {team.leaderName}
				</p>
				<div className={styles.dash}></div>
				<Tippy content={i18n.t('Team.soteamcon')}>
					<div className={styles.icon}>
						<FaUserGroup size={19} color='#EB2E2E' />
					</div>
				</Tippy>
				<p className={styles.totalTeam}>{team?.totalSubTeams}</p>
				<div className={styles.dash}></div>
				<Tippy content={i18n.t('Team.sothanhvien')}>
					<div className={styles.icon}>
						<GiPerson size={22} color='#4DBFDD' />
					</div>
				</Tippy>
				<p className={styles.totalUser}>{team?.totalUsers}</p>
				<div className={styles.dash}></div>
				<Tippy content={i18n.t('Team.sothietbi')}>
					<div className={styles.icon}>
						<FaChromecast size={18} color='#4DBFDD' />
					</div>
				</Tippy>
				<p className={styles.totalDevice}>{team?.totalDevices}</p>
				<div className={styles.line}></div>
				<Tippy content={i18n.t('Team.xemchitiet')}>
					<Link href={`/team/${team.uuid}`} className={styles.icon}>
						<Eye size={20} color='#777E90' />
					</Link>
				</Tippy>
				<div className={styles.line}></div>
				<Tippy content={i18n.t('Common.chinhsua')}>
					<Link href={`/team/chinh-sua?_id=${team.uuid}`} className={styles.icon}>
						<LuPencil size={20} color='#777E90' />
					</Link>
				</Tippy>
			</div>

			{open && (
				<div className={clsx(styles.teamList)}>
					{listTreeTeams.isLoading ? (
						<div className={styles.loading}>
							<RiLoader4Fill size={24} color='#2D74FF' />
						</div>
					) : (
						<>
							{listTreeTeams.data?.map((v: any) => (
								<TreeTeam key={v.uuid} team={v} level={level + 1} />
							))}
						</>
					)}
				</div>
			)}
		</Fragment>
	);
}

export default TreeTeam;
