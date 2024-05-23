import React from 'react';

import {PropsMainDetailDevice} from './interfaces';
import styles from './MainDetailDevice.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import InfoTransmitter from '../InfoDevice';
import HistoryTransmitter from '../HistoryDevice';

function MainDetailDevice({}: PropsMainDetailDevice) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý bộ phát',
						path: PATH.BoPhat,
					},
					{
						title: 'Chi tiết bộ phát',
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
