import React from 'react';

import {PropsMainDetailGateway} from './interfaces';
import styles from './MainDetailGateway.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import ListDeviceGateway from '../ListDeviceGateway';
import TableInforGateway from '../TableInforGateway';
import i18n from '~/locale/i18n';

function MainDetailGateway({}: PropsMainDetailGateway) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('Gateway.GatewayList'),
						path: PATH.Gateway,
					},
					{
						title: i18n.t('Gateway.GatewayDetails'),
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
				<TableInforGateway />
				<div className='mt'>
					<ListDeviceGateway />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainDetailGateway;
