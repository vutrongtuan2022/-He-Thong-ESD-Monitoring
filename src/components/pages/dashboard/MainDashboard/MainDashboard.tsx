import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
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
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';

function MainDashboard({}: PropsMainDashboard) {
	const dashboardOverview = useQuery([QUERY_KEY.trang_chu_tong_quan], {
		queryFn: () =>
			httpRequest({
				http: dashboardServices.dashboardOverview({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

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
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.totalDevice}
						text='Tổng số bộ phát'
						icon={<MdCast size={30} color='#4DBFDD' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.totalDeviceOnline}
						text='Số bộ phát đang hoạt động'
						icon={<MdCast size={30} color='#2CAE39' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.totalDeviceNG}
						text='Số bộ phát NG'
						icon={<MdCast size={30} color='#EB2E2E' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.longestNGTime}
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

export default MainDashboard;
