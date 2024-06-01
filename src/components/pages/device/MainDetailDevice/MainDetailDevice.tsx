import React from 'react';

import {PropsMainDetailDevice} from './interfaces';
import styles from './MainDetailDevice.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import InfoTransmitter from '../InfoDevice';
import HistoryTransmitter from '../HistoryDevice';
import i18n from '~/locale/i18n';

function MainDetailDevice({}: PropsMainDetailDevice) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Device.TransmitterManagement'),
						path: PATH.Device,
					},
					{
						title: i18n.t('Device.TransmitterDetails'),
						path: '',
					},
				]}
				action={
					<div className={styles.main_action}>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<InfoTransmitter />
				<HistoryTransmitter />
			</WrapperContainer>
		</div>
	);
}

export default MainDetailDevice;
