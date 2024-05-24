import React, {useEffect} from 'react';
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
import {Data, TextalignJustifycenter, User} from 'iconsax-react';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import TableTeam from '../MainTableTeam';
import teamServices from '~/services/teamServices';
import MainTreeTeam from '../MainTreeTeam';

function MainPageTeam({}: PropsMainPageTeam) {
	const router = useRouter();

	const {_view} = router.query;

	const listUsers = useQuery([QUERY_KEY.dropdown_danh_sach_nguoi_dung], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listUser({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const sumTeams = useQuery([QUERY_KEY.thong_so_chung_team], {
		queryFn: () =>
			httpRequest({
				http: teamServices.getSumTeam({}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (_view == 'tree') {
			const {_page, _pageSize, _keyword, _leaderUuid, _status, ...rest} = router.query;

			router.replace(
				{
					pathname: router.pathname,
					query: {
						...rest,
					},
				},
				undefined,
				{
					scroll: false,
					shallow: false,
				}
			);
		}
	}, [_view]);

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
						<ItemDashboard
							isLoading={sumTeams.isLoading}
							value={sumTeams?.data?.totalTeam}
							text='Tổng số team'
							icon={<HiOutlineUserGroup size={32} color='#EB2E2E' />}
						/>
						<ItemDashboard
							isLoading={sumTeams.isLoading}
							value={sumTeams?.data?.totalUserTeam}
							text='Tổng nhân viên trong team'
							icon={<User size={30} color='#4DBFDD' />}
						/>
						<ItemDashboard
							isLoading={sumTeams.isLoading}
							value={sumTeams?.data?.totalDeviceTeam}
							text='Tổng thiết bị trong team'
							icon={<MdCast size={30} color='#4DBFDD' />}
						/>
					</GridColumn>
				</div>
				<div className={styles.head}>
					{_view == 'tree' ? (
						<h4 className={styles.title}>Sơ đồ team</h4>
					) : (
						<div className={styles.box_filter}>
							<div className={styles.search}>
								<Search keyName='_keyword' placeholder='Tìm kiếm theo tên hoặc mã' />
							</div>
							<div className={styles.filter}>
								<FilterCustom
									isSearch
									name='Leader'
									query='_leaderUuid'
									listFilter={listUsers?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.name,
									}))}
								/>
							</div>
							<div className={styles.filter}>
								<FilterCustom
									name='Trạng thái'
									query='_status'
									listFilter={[
										{id: STATUS_GENERAL.SU_DUNG, name: 'Sử dụng'},
										{id: STATUS_GENERAL.KHONG_SU_DUNG, name: 'Không sử dụng'},
									]}
								/>
							</div>
						</div>
					)}
					<div className={styles.control}>
						<div
							className={clsx(styles.item, {[styles.active]: !_view})}
							onClick={() => {
								const {_view, ...rest} = router.query;

								return router.replace(
									{
										pathname: router.pathname,
										query: {
											...rest,
										},
									},
									undefined,
									{
										scroll: false,
										shallow: false,
									}
								);
							}}
						>
							<TextalignJustifycenter size={20} color='#fff' />
						</div>
						<div
							className={clsx(styles.item, {[styles.active]: _view == 'tree'})}
							onClick={() => {
								const {_view, ...rest} = router.query;

								return router.replace(
									{
										pathname: router.pathname,
										query: {
											...rest,
											_view: 'tree',
										},
									},
									undefined,
									{
										scroll: false,
										shallow: false,
									}
								);
							}}
						>
							<Data size={20} color='#fff' />
						</div>
					</div>
				</div>

				<div className={styles.wrapper}>
					{!_view && <TableTeam />}
					{_view == 'tree' && <MainTreeTeam />}
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageTeam;
