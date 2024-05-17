import React from 'react';

import {PropsMaindDashboard} from './interfaces';
import styles from './MaindDashboard.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import GridColumn from '~/components/layouts/GridColumn';
import ItemDashboard from '../ItemDashboard';
import {MdCast} from 'react-icons/md';
import {FaRegHourglassHalf} from 'react-icons/fa6';
import MainChart from '../MainChart';
import ListTransmitter from '../ListTransmitter';

function MaindDashboard({}: PropsMaindDashboard) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Tổng quan',
						path: '',
					},
				]}
				action={
					<div className={styles.main_action}>
						<BsThreeDots className={styles.dots} color='#23262f' size={20} />
					</div>
				}
			/>
			<WrapperContainer>
				<GridColumn col_4>
					<ItemDashboard value={80} text='Tổng số bộ phát' icon={<MdCast size={30} color='#4DBFDD' />} />
					<ItemDashboard value={80} text='Số bộ phát đang hoạt động' icon={<MdCast size={30} color='#2CAE39' />} />
					<ItemDashboard value={80} text='Số bộ phát NG' icon={<MdCast size={30} color='#EB2E2E' />} />
					<ItemDashboard
						value={'3p30s'}
						text='Khoảng thời gian NG lâu nhất'
						icon={<FaRegHourglassHalf size={30} color='#ED8145' />}
					/>
				</GridColumn>
				<div className='mt'>
					<MainChart />
				</div>
				<div className='mt'>
					<ListTransmitter />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MaindDashboard;
