import React from 'react';
import Image from 'next/image';

import {PropsMainPageTeam} from './interfaces';
import styles from './MainPageTeam.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {BsThreeDots} from 'react-icons/bs';
import GridColumn from '~/components/layouts/GridColumn';
import ItemDashboard from '../../dashboard/ItemDashboard';
import {MdCast} from 'react-icons/md';
import {HiOutlineUserGroup} from 'react-icons/hi';
import {User} from 'iconsax-react';

function MainPageTeam({}: PropsMainPageTeam) {
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: 'Trang chủ',
					},
					{
						path: '',
						title: 'Danh sách team',
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
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								blue_light
								bold
								icon={<Image alt='icon import' src={icons.import_excel} width={20} height={20} />}
							>
								Import excel
							</Button>
						</div>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								primary
								bold
								icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
								href={PATH.ThemTeam}
							>
								Thêm mới
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
					<GridColumn>
						<ItemDashboard value={80} text='Tổng số team' icon={<HiOutlineUserGroup size={32} color='#EB2E2E' />} />
						<ItemDashboard value={80} text='Tổng nhân viên trong team' icon={<User size={30} color='#4DBFDD' />} />
						<ItemDashboard value={80} text='Tổng thiết bị trong team' icon={<MdCast size={30} color='#4DBFDD' />} />
					</GridColumn>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageTeam;
