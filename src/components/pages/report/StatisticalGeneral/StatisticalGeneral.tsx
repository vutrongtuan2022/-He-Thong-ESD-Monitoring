import React from 'react';

import {PropsStatisticalGeneral} from './interfaces';
import styles from './StatisticalGeneral.module.scss';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import GridColumn from '~/components/layouts/GridColumn';
import ItemStatistical from '../ItemStatistical';
import {FaChromecast, FaRegClock} from 'react-icons/fa';
import {RiTimerFlashFill} from 'react-icons/ri';
import i18n from '~/locale/i18n';

function StatisticalGeneral({}: PropsStatisticalGeneral) {
	return (
		<div className={styles.container}>
			<div className={styles.top}>
				<div>
					<h6>{i18n.t('Report.ReportStatistics')}</h6>
					<p className={styles.des}>{i18n.t('Report.MonitorOrderProcessingPlansandWorkPlans')}</p>
				</div>
				<DateRangerCustom />
			</div>
			<GridColumn col_3>
				<ItemStatistical
					text={i18n.t('Report.TotalNumberofNGTransmittersForAllTeams')}
					value={8}
					bg='#F95B5B'
					icon={<FaChromecast size={24} color='#fff' />}
				/>
				<ItemStatistical
					text={i18n.t('Report.TotalTimeNGForTeams')}
					value={'15p 20s'}
					bg='#2D74FF'
					icon={<RiTimerFlashFill size={24} color='#fff' />}
				/>
				<ItemStatistical
					text={i18n.t('Report.TotalWorkingTimeOfTeams')}
					value={'36 giờ 20p 50s'}
					bg='#4ECB71'
					icon={<FaRegClock size={24} color='#fff' />}
				/>
			</GridColumn>
		</div>
	);
}

export default StatisticalGeneral;
