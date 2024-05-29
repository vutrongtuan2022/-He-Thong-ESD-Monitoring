import React, {useState} from 'react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

import {PropsMainChart} from './interfaces';
import styles from './MainChart.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import dashboardServices from '~/services/dashboardServices';

function MainChart({}: PropsMainChart) {
	const [dataChart, setDataChart] = useState<any[]>([]);
	const [allTimeDeviceOnline, setAllTimeDeviceOnline] = useState<number>(0);
	const [allTimeDeviceNG, setAllTimeDeviceNG] = useState<number>(0);

	useQuery([QUERY_KEY.trang_chu_bieu_do], {
		queryFn: () =>
			httpRequest({
				http: dashboardServices.dashboardChart({}),
			}),
		onSuccess(data) {
			setAllTimeDeviceOnline(data?.allTimeDeviceOnline);
			setAllTimeDeviceNG(data?.allTimeDeviceNG);
			setDataChart(
				data?.dashboardChartResp?.map((v: any, i: number) => {
					return {
						time: `${v?.timeCheck}: 00`,
						'Bộ phát hoạt động': v?.totalDeviceOnline || 0,
						'Bộ phát NG': v?.totalDeviceNG || 0,
					};
				})
			);
		},
		refetchInterval: 50000, // 5phút/1 lần call api
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>Biểu đồ thống kê số lượng bộ phát NG</h4>
				<div className={styles.right}>
					<div style={{marginLeft: '12px'}} className={styles.item}>
						<Image src={icons.icon_chart_2} alt='Icon chart' />
						<p>
							Bộ phát NG: <span style={{color: '#FF6666'}}>{allTimeDeviceNG}</span>
						</p>
					</div>
					<div className={styles.item}>
						<Image src={icons.icon_chart_1} alt='Icon chart' />
						<p>
							Bộ phát hoạt động: <span style={{color: '#4ECB71'}}>{allTimeDeviceOnline}</span>
						</p>
					</div>
				</div>
			</div>
			<div className={styles.main}>
				<ResponsiveContainer>
					<LineChart width={730} height={250} data={dataChart} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
						<CartesianGrid vertical={false} opacity={0.5} strokeDasharray='none' />
						<XAxis dataKey='time' />
						<Tooltip />
						<YAxis />
						<Line type='linear' dataKey='Bộ phát hoạt động' stroke='#4ECB71' strokeWidth={3} />
						<Line type='linear' dataKey='Bộ phát NG' stroke='#FF6666' strokeWidth={3} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default MainChart;
