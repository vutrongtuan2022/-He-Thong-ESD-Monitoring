import React from 'react';

import {PropsMainDetailUser} from './interfaces';
import styles from './MainDetailUser.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import InfoUser from '../InfoUser';
import i18n from '~/locale/i18n';

function MainDetailUser({}: PropsMainDetailUser) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('User.Quanlynhanvien'),
						path: PATH.NhanVien,
					},
					{
						title: i18n.t('User.Chitietnhanvien'),
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
