import React from 'react';

import {PropsMainPageDetailGateway} from './interfaces';
import styles from './MainPageDetailGateway.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';

import {MdCast} from 'react-icons/md';
import {FaRegHourglassHalf} from 'react-icons/fa6';
import ListTransmitter from '../ListTransmitter';
import TableInfor from '../TableInfor';

function MainPageDetailGateway({}: PropsMainPageDetailGateway) {
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
				<div>
					<TableInfor />
				</div>

				<div className='mt'>
					<ListTransmitter />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageDetailGateway;
