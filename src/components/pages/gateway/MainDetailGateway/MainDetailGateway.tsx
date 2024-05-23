import React from 'react';

import {PropsMainDetailGateway} from './interfaces';
import styles from './MainDetailGateway.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import ListDeviceGateway from '../ListDeviceGateway';
import TableInforGateway from '../TableInforGateway';

function MainDetailGateway({}: PropsMainDetailGateway) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Danh sách gateway',
						path: PATH.Gateway,
					},
					{
						title: 'Chi tiết gateway',
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
