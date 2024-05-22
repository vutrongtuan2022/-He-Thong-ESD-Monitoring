import React from 'react';

import {PropsMainPageDetailTeam} from './interfaces';
import styles from './MainPageDetailTeam.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import teamServices from '~/services/teamServices';
import {useRouter} from 'next/router';
import TabNavLink from '~/components/common/TabNavLink';
import TableTeam from './components/TableTeam';
import TableUser from './components/TableUser';
import TableDevice from './components/TableDevice';
import TableHistory from './components/TableHistory';
import clsx from 'clsx';

function MainPageDetailTeam({}: PropsMainPageDetailTeam) {
	const router = useRouter();

	const {_id, _table} = router.query;

	const detailTeam = useQuery([QUERY_KEY.chi_tiet_team, _id], {
		queryFn: () =>
			httpRequest({
				http: teamServices.detailTeam({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: 'Trang chủ',
					},
					{
						path: PATH.Team,
						title: 'Danh sách team',
					},
					{
						path: '',
						title: 'Chi tiết team',
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
				<div className={styles.main}>
					<div className={styles.header}>
						<Link href={PATH.Team} className={styles.header_title}>
							<IoArrowBackOutline fontSize={20} fontWeight={600} />
							<p>Thông tin team</p>
						</Link>
						<div className={styles.list_btn}>
							<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold>
								Xóa bỏ
							</Button>

							<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold>
								Chỉnh sửa
							</Button>
						</div>
					</div>
					<div className={clsx('mt', styles.table)}>
						<table className={styles.containertable}>
							<colgroup>
								<col style={{width: '50%'}} />
								<col style={{width: '50%'}} />
							</colgroup>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Mã team:</span>
									{'1'}
								</td>
								<td>
									<span style={{marginRight: 6}}>Người quản lý team: </span> {'---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Tên team: </span> {'Tên team: Team của Nguyễn Trọng Lý'}
								</td>
								<td>
									<span style={{marginRight: 6}}>ID người quản lý: </span>
									{'---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Số team phụ thuộc: </span>
									{2}
								</td>
								<td>
									<span style={{marginRight: 6}}>Thuộc team: </span>
									{'Team sản xuất - Dương Minh nghĩa'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Số thành viên: </span> {5}
								</td>
								<td rowSpan={2} className={styles.description}>
									<span style={{marginRight: 6}}>Ghi chú:</span>
									{'---'}
								</td>
							</tr>
							<tr>
								<td>
									<span style={{marginRight: 6}}>Số thiết bị: </span>
									{5}
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div className={styles.main}>
					<TabNavLink
						outline
						query='_table'
						listHref={[
							{
								pathname: router.pathname,
								query: null,
								title: 'Danh sách team phụ thuộc',
							},
							{
								pathname: router.pathname,
								query: 'nhan-vien',
								title: 'Danh sách nhân viên',
							},
							{
								pathname: router.pathname,
								query: 'bo-phat',
								title: 'Danh sách bộ phát',
							},
							{
								pathname: router.pathname,
								query: 'lich-su',
								title: 'Lịch sử bộ phát',
							},
						]}
					/>
					<div className={styles.main_table}>
						{!_table && <TableTeam />}
						{_table == 'nhan-vien' && <TableUser />}
						{_table == 'bo-phat' && <TableDevice />}
						{_table == 'lich-su' && <TableHistory />}
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageDetailTeam;
