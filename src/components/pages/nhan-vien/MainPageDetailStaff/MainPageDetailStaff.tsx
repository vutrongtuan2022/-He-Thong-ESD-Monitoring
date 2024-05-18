import React from 'react';

import {PropsMainPageDetailStaff} from './interfaces';
import styles from './MainPageDetailStaff.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import TableInfor from '../TableInfor';

function MainPageDetailStaff({}: PropsMainPageDetailStaff) {
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
				<div>
					<TableInfor />
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageDetailStaff;
