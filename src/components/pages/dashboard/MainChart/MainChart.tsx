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
import DatePicker from '~/components/common/DatePicker';
import moment from 'moment';
import i18n from '~/locale/i18n';

function MainChart({}: PropsMainChart) {
	const [date, setDate] = useState<Date | null>(new Date());
	const [dataChart, setDataChart] = useState<any[]>([]);
	const [allTimeDeviceOnline, setAllTimeDeviceOnline] = useState<number>(0);
	const [allTimeDeviceNG, setAllTimeDeviceNG] = useState<number>(0);

	useQuery([QUERY_KEY.trang_chu_bieu_do, date], {
		queryFn: () =>
			httpRequest({
				http: dashboardServices.dashboardChart({
					date: moment(date).format('YYYY-MM-DD'),
				}),
			}),
		onSuccess(data) {
			setAllTimeDeviceOnline(data?.allTimeDeviceOnline);
			setAllTimeDeviceNG(data?.allTimeDeviceNG);
			setDataChart(
				data?.dashboardChartResp?.map((v: any, i: number) => {
					return {
						time: `${v?.timeCheck}: 00`,
						[i18n.t('Overview.GeneratorIsWorking')]: v?.totalDeviceOnline || 0,
						[i18n.t('Overview.GeneratorNG')]: v?.totalDeviceNG || 0,
					};
				})
			);
		},
		refetchInterval: 50000, // 5phút/1 lần call api
		enabled: !!date,
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>{i18n.t('Overview.StatisticalChart')}</h4>
				<div className={styles.right}>
					<div style={{marginLeft: '12px'}} className={styles.item}>
						<Image src={icons.icon_chart_2} alt='Icon chart' />
						<p>
							{i18n.t('Overview.GeneratorNG')}: <span style={{color: '#FF6666'}}>{allTimeDeviceNG}</span>
						</p>
					</div>
					<div className={styles.item}>
						<Image src={icons.icon_chart_1} alt='Icon chart' />
						<p>
							{i18n.t('Overview.GeneratorIsWorking')}: <span style={{color: '#4ECB71'}}>{allTimeDeviceOnline}</span>
						</p>
					</div>

					<DatePicker name='date' icon={true} value={date} onSetValue={setDate} placeholder='' className={styles.date} />
				</div>
			</div>
			<div className={styles.main}>
				<ResponsiveContainer>
					<LineChart width={730} height={250} data={dataChart} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
						<CartesianGrid vertical={false} opacity={0.5} strokeDasharray='none' />
						<XAxis dataKey='time' />
						<Tooltip />
						<YAxis />
						<Line type='linear' dataKey={i18n.t('Overview.GeneratorIsWorking')} stroke='#4ECB71' strokeWidth={3} />
						<Line type='linear' dataKey={i18n.t('Overview.GeneratorNG')} stroke='#FF6666' strokeWidth={3} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default MainChart;
