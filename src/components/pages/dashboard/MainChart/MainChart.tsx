import React from 'react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

import {PropsMainChart} from './interfaces';
import styles from './MainChart.module.scss';
import {dataChart} from '~/constants/config/data';
import Image from 'next/image';
import icons from '~/constants/images/icons';

function MainChart({}: PropsMainChart) {
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h4>Biểu đồ thống kê số lượng bộ phát NG</h4>
				<div className={styles.right}>
					<div className={styles.item}>
						<Image src={icons.icon_chart_1} alt='Icon chart' />
						<p>
							Bộ phát hoạt động: <span style={{color: '#4ECB71'}}>10</span>
						</p>
					</div>
					<div style={{marginLeft: '12px'}} className={styles.item}>
						<Image src={icons.icon_chart_2} alt='Icon chart' />
						<p>
							Bộ phát NG: <span style={{color: '#FF6666'}}>10</span>
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
						<Line type='monotone' dataKey='Bộ phát hoạt động' stroke='#4ECB71' strokeWidth={3} />
						<Line type='monotone' dataKey='Bộ phát NG' stroke='#FF6666' strokeWidth={3} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default MainChart;
