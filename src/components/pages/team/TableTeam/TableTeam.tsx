import React from 'react';

import {PropsTableTeam} from './interfaces';
import styles from './TableTeam.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Moment from 'react-moment';

function TableTeam({}: PropsTableTeam) {
	return (
		<div className={styles.container}>
			<DataWrapper data={[1, 2, 3]} loading={false} noti={<Noti title='Team trống' des='Danh sách team trống!' />}>
				<Table
					data={[1, 2, 3]}
					column={[
						{
							title: 'STT',
							render: (data: any, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Tên team',
							render: (data: any) => <>{1}</>,
						},
						{
							title: 'Mã team',
							render: (data: any) => (
								<Link href={`/team/${data.uuid}`} className={styles.link}>
									{data.macNumber}
								</Link>
							),
						},
						{
							title: 'Người quản lý team',
							render: (data: any) => <>{data.teamName || '---'}</>,
						},
						{
							title: 'Số thành viên',
							render: (data: any) => <>{data.teamName || '---'}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: any) => <>{data.battery}%</>,
						},
						{
							title: 'Khu vực',
							render: (data: any) => <>{data.battery}%</>,
						},
						{
							title: 'Online lần cuối',
							render: (data: any) => <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' />,
						},
						// {
						// 	title: 'Tác vụ',
						// 	render: (data: any) => (
						// 		<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
						// 			<IconCustom
						// 				edit
						// 				icon={<LuPencil fontSize={20} fontWeight={600} />}
						// 				tooltip='Chỉnh sửa'
						// 				color='#777E90'
						// 				onClick={() => setDataUpdate(data)}
						// 			/>

						// 			<IconCustom
						// 				delete
						// 				icon={<Trash size='22' />}
						// 				tooltip='Khóa'
						// 				color='#777E90'
						// 				onClick={() => setDataChangeStatus(data)}
						// 			/>
						// 		</div>
						// 	),
						// },
					]}
				/>
				{/* <Pagination
					currentPage={Number(_page) || 1}
					total={listDevices?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _pin, _onlineState, _ngState, _status]}
				/> */}
			</DataWrapper>
		</div>
	);
}

export default TableTeam;
