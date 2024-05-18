import React, {Fragment} from 'react';
import {PropsTableTimeOfTeam} from './interfaces';
import styles from './TableTimeOfTeam.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';

function TableTimeOfTeam({}: PropsTableTimeOfTeam) {
	return (
		<Fragment>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG SỐ TEAM: <span>04</span>
					</div>
					<div>
						TỔNG SỐ THỜI GIAN NG: <span>15P20S</span>
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper data={[1, 2, 3]} loading={false}>
					<Table
						data={[1, 2, 3]}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Tên Team',
								render: (data: any) => (
									<>Team Dương Minh Nghĩa</>
									// <Moment date={'Fri May 17 2024 09:49:15 GMT+0700 (Indochina Time)'} format='HH:mm, DD/MM/YYYY' />
								),
							},
							{
								title: 'Mã team',
								render: (data: any) => (
									<Link href={`/thong-ke/6478384343`} className={styles.link}>
										6478384343
									</Link>
								),
							},
							{
								title: 'Người quản lý',
								render: (data: any) => <>Minh Vũ</>,
							},
							{
								title: 'SL thiết bị NG',
								render: (data: any) => <>9</>,
							},
							{
								title: 'SL thành viên NG',
								render: (data: any) => <>9</>,
							},
							{
								title: 'Thời gian NG',
								render: (data: any) => <>6 phút 10 giây</>,
							},
						]}
					/>
					<Pagination currentPage={1} total={400} pageSize={20} dependencies={[]} />
				</DataWrapper>
			</div>
		</Fragment>
	);
}

export default TableTimeOfTeam;
