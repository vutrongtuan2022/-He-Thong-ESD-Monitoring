import React, {Fragment} from 'react';
import {PropsTableTransmitterList} from './interfaces';
import styles from './TableTransmitterList.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Pagination from '~/components/common/Pagination';
import clsx from 'clsx';

function TableTransmitterList({}: PropsTableTransmitterList) {
	return (
		<Fragment>
			<div className={clsx('mt')}>
				<div className={styles.parameter}>
					<div>
						TỔNG SỐ TEAM: <span>04</span>
					</div>
					<div>
						TỔNG SỐ BỘ PHÁT NG: <span>05</span>
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
									<Link href={`/report/6478384343`} className={styles.link}>
										6478384343
									</Link>
								),
							},
							{
								title: 'Leader team',
								render: (data: any) => <>Minh Vũ</>,
							},
							{
								title: 'Mã leader',
								render: (data: any) => <>92920231</>,
							},
							{
								title: 'Số lượng bộ phát NG',
								render: (data: any) => <>2</>,
							},
						]}
					/>
				</DataWrapper>
				<Pagination currentPage={1} total={400} pageSize={20} dependencies={[]} />
			</div>
		</Fragment>
	);
}

export default TableTransmitterList;
