import React from 'react';

import Image from 'next/image';

import {PropsHistoryTransmitter} from './interfaces';
import styles from './HistoryTransmitter.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Status from '~/components/common/Status';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';

function HistoryTransmitter({}: PropsHistoryTransmitter) {
	return (
		<div className={styles.container}>
			<h4>Lịch sử bộ phát NG (04)</h4>
			<div className={styles.flex}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search placeholder='Tìm kiếm theo số MAC, tên thiết bị' />
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Team'
							query='_team'
							listFilter={[
								{id: 1, name: 'Team 1'},
								{id: 2, name: 'Team 2'},
							]}
						/>
					</div>
				</div>
				<div>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_6_16
						green
						bold
						icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
					>
						Export excel
					</Button>
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
								title: 'Thời gian phát hiện NG',
								render: (data: any) => (
									<Moment date={'Fri May 17 2024 09:49:15 GMT+0700 (Indochina Time)'} format='HH:mm, DD/MM/YYYY' />
								),
							},
							{
								title: 'Khoảng thời gian NG',
								render: (data: any) => <>20 phút 2 giây</>,
							},
							{
								title: 'Giá trị tĩnh điện',
								render: (data: any) => <>8^4</>,
							},
							{
								title: 'Thuộc team',
								render: (data: any) => <>Team của Dương Minh Nghĩa</>,
							},
							{
								title: 'Mã team',
								render: (data: any) => <>24444112</>,
							},
						]}
					/>
					<Pagination currentPage={1} total={400} pageSize={20} dependencies={[]} />
				</DataWrapper>
			</div>
		</div>
	);
}

export default HistoryTransmitter;
