import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {Data, PictureFrame, TextalignJustifycenter} from 'iconsax-react';

import {PropsMainFactoryArea} from './interfaces';
import styles from './MainFactoryArea.module.scss';
import Loading from '~/components/common/Loading';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import Popup from '~/components/common/Popup';
import MainCreateArea from '../MainCreateArea';
import GridColumn from '~/components/layouts/GridColumn';
import ItemDashboard from '../../dashboard/ItemDashboard';
import {HiOutlineUserGroup} from 'react-icons/hi';
import TableArea from '../TableArea';
import MainTreeArea from '../MainTreeArea';
import {GrMap} from 'react-icons/gr';
import {FaChromecast, FaUser} from 'react-icons/fa';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import i18n from '~/locale/i18n';
import ImportExcel from '~/components/common/ImportExcel';

function MainFactoryArea({}: PropsMainFactoryArea) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_open, _view, _page, _pageSize, _keyword, _status, importExcel} = router.query;

	const [file, setFile] = useState<any>(null);

	const sumAreas = useQuery([QUERY_KEY.thong_so_chung_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getSumArea({}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (_view == 'tree') {
			const {_page, _pageSize, _keyword, _status, _open, ...rest} = router.query;

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
				http: areaServices.exportExcel({
					keyword: _keyword as string,
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					status: _status ? Number(_status) : null,
					parentUuid: null,
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
				http: areaServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_khu_vuc, _page, _pageSize, _keyword, _status]);
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
						title: 'Trang chủ',
					},
					{
						path: '',
						title: 'Danh sách khu vực',
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
								onClick={() =>
									router.replace(
										{
											pathname: PATH.Khuvuc,
											query: {
												...router.query,
												_open: 'create',
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
					<GridColumn col_5>
						<ItemDashboard
							isLoading={sumAreas.isLoading}
							value={sumAreas?.data?.totalParentArea}
							text='Khu vực chính'
							icon={<GrMap size={32} color='#2D74FF' />}
						/>
						<ItemDashboard
							isLoading={sumAreas.isLoading}
							value={sumAreas?.data?.totalChildArea}
							text='Khu vực con'
							icon={<PictureFrame size={32} color='#11B991' />}
						/>
						<ItemDashboard
							isLoading={sumAreas.isLoading}
							value={sumAreas?.data?.totalTeam}
							text='Tổng số team'
							icon={<HiOutlineUserGroup size={32} color='#EB2E2E' />}
						/>
						<ItemDashboard
							isLoading={sumAreas.isLoading}
							value={sumAreas?.data?.totalUserTeam}
							text='Tổng nhân viên'
							icon={<FaUser size={32} color='#4DBFDD' />}
						/>
						<ItemDashboard
							isLoading={sumAreas.isLoading}
							value={sumAreas?.data?.totalDeviceTeam}
							text='Tổng thiết bị'
							icon={<FaChromecast size={32} color='#4DBFDD' />}
						/>
					</GridColumn>
				</div>
				<div className={styles.head}>
					{_view == 'tree' ? (
						<h4 className={styles.title}>Sơ đồ khu vực</h4>
					) : (
						<div className={styles.box_filter}>
							<div className={styles.search}>
								<Search keyName='_keyword' placeholder='Tìm kiếm theo tên hoặc mã khu vực' />
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
					{!_view && <TableArea />}
					{_view == 'tree' && <MainTreeArea />}
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Popup
				open={_open == 'create'}
				onClose={() => {
					const {_open, ...rest} = router.query;

					router.replace(
						{
							pathname: PATH.Khuvuc,
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
				<MainCreateArea
					onClose={() => {
						const {_open, ...rest} = router.query;

						router.replace(
							{
								pathname: PATH.Khuvuc,
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
				/>
			</Popup>

			<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-factory-area'
					file={file}
					pathTemplate='/static/files/Mau_Import_FactoryArea.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={fucnImportExcel.mutate}
				/>
			</Popup>
		</div>
	);
}

export default MainFactoryArea;
