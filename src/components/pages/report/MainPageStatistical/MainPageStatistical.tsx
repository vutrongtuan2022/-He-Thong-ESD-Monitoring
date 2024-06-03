import React from 'react';
import Image from 'next/image';

import {PropsMainPageStatistical} from './interfaces';
import styles from './MainPageStatistical.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import StatisticalGeneral from '../StatisticalGeneral';
import DetailStatistical from '../DetailStatistical';
import i18n from '~/locale/i18n';

function MainPageStatistical({}: PropsMainPageStatistical) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.Home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Report.ReportStatistics'),
						path: '',
					},
				]}
				action={
					<div className={styles.main_action}>
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
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.main}>
					<StatisticalGeneral />
					<DetailStatistical />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageStatistical;
