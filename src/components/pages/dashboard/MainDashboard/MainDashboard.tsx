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
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';
import {formatTimeHistory} from '~/common/funcs/optionConvert';
import ListDeviceNG from '../ListDeviceNG';
import i18n from '~/locale/i18n';

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
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Overview.Overview'),
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
						text={i18n.t('Overview.TransmittersTotal')}
						icon={<MdCast size={30} color='#4DBFDD' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.totalDeviceOnline}
						text={i18n.t('Overview.TransmittersActive')}
						icon={<MdCast size={30} color='#2CAE39' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={dashboardOverview?.data?.totalDeviceNG}
						text={i18n.t('Overview.TransmittersNG')}
						icon={<MdCast size={30} color='#EB2E2E' />}
					/>
					<ItemDashboard
						isLoading={dashboardOverview.isLoading}
						value={formatTimeHistory(dashboardOverview?.data?.longestNGTime || 0)}
						text={i18n.t('Overview.DurationNGLongest')}
						icon={<FaRegHourglassHalf size={30} color='#ED8145' />}
					/>
				</GridColumn>
				<div className='mt'>
					<MainChart />
				</div>
				<div className='mt'>
					<ListDeviceNG />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainDashboard;
