import React from 'react';

import {PropsMainDetailUser} from './interfaces';
import styles from './MainDetailUser.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import InfoUser from '../InfoUser';

function MainDetailUser({}: PropsMainDetailUser) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Danh sách nhân viên',
						path: PATH.NhanVien,
					},
					{
						title: 'Chi tiết nhân viên',
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
				<InfoUser />
			</WrapperContainer>
		</div>
	);
}

export default MainDetailUser;
