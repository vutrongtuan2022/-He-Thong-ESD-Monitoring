import React, {useEffect, useState} from 'react';
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
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import TableTeam from '../MainTableTeam';
import teamServices from '~/services/teamServices';
import MainTreeTeam from '../MainTreeTeam';
import i18n from '~/locale/i18n';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import ImportExcel from '~/components/common/ImportExcel';

function MainPageTeam({}: PropsMainPageTeam) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_view, _page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status, importExcel} = router.query;

	const [file, setFile] = useState<any>(null);

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

	const listAreas = useQuery([QUERY_KEY.dropdown_danh_sach_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listArea({
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
			const {_page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status, ...rest} = router.query;

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

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: teamServices.exportExcel({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: _status ? Number(_status) : null,
					leaderUuid: _leaderUuid ? [_leaderUuid as string] : null,
					areaUuid: _areaUuid ? (_areaUuid as string) : null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	// Func import excel
	const fucnImportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Device.importfilethanhcong'),
				http: teamServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_team]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_team, _page, _pageSize, _keyword, _leaderUuid, _areaUuid, _status]);
			}
		},
	});

	// Close popup import excel
	const handleCloseImportExcel = () => {
		const {importExcel, ...rest} = router.query;

		setFile(null);
		router.replace(
			{
				query: rest,
			},
			undefined,
			{scroll: false}
		);
	};

	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading || fucnImportExcel.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.home'),
					},
					{
						path: '',
						title: i18n.t('Team.Danhsachteam'),
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
								onClick={exportExcel.mutate}
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
								onClick={() =>
									router.replace(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												importExcel: 'open',
											},
										},
										undefined,
										{
											scroll: false,
											shallow: false,
										}
									)
								}
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
								{i18n.t('Common.Themmoi')}
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
							text={i18n.t('Team.Tongsoteam')}
							icon={<HiOutlineUserGroup size={32} color='#EB2E2E' />}
						/>
						<ItemDashboard
							isLoading={sumTeams.isLoading}
							value={sumTeams?.data?.totalUserTeam}
							text={i18n.t('Team.Tongsonhanvientrongteam')}
							icon={<User size={30} color='#4DBFDD' />}
						/>
						<ItemDashboard
							isLoading={sumTeams.isLoading}
							value={sumTeams?.data?.totalDeviceTeam}
							text={i18n.t('Team.TongSothietbitrongteam')}
							icon={<MdCast size={30} color='#4DBFDD' />}
						/>
					</GridColumn>
				</div>
				<div className={styles.head}>
					{_view == 'tree' ? (
						<h4 className={styles.title}>{i18n.t('Team.Sodoteam')}</h4>
					) : (
						<div className={styles.box_filter}>
							<div className={styles.search}>
								<Search keyName='_keyword' placeholder={i18n.t('Team.Timkiemtheotenmateam')} />
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
									isSearch
									name={i18n.t('Common.Khuvuc')}
									query='_areaUuid'
									listFilter={listAreas?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.name,
									}))}
								/>
							</div>
							<div className={styles.filter}>
								<FilterCustom
									name={i18n.t('Common.Trangthai')}
									query='_status'
									listFilter={[
										{id: STATUS_GENERAL.SU_DUNG, name: i18n.t('Common.sudung')},
										{id: STATUS_GENERAL.KHONG_SU_DUNG, name: i18n.t('Common.khongsudung')},
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

			<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-team'
					file={file}
					pathTemplate='/static/files/Mau_Import_Team.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={fucnImportExcel.mutate}
				/>
			</Popup>
		</div>
	);
}

export default MainPageTeam;
