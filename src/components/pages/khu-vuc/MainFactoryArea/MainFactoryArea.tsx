import React from 'react';
import Image from 'next/image';

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
import {STATUS_GENERAL} from '~/constants/config/enum';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import TableDropDown from '../TableDropDown';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';

function MainFactoryArea({}: PropsMainFactoryArea) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _status} = router.query;

	const data = [
		{
			id: '1',
			maKho: 'MK01',
			tenkho: 'Kho 01',
			soKhoCon: 3,
			sanLuongMT: 1200000,
			sanLuongBDMT: 150000,
			nhap: 1000000,
			xuat: 5000000,
			child: [
				{
					id: '1_1',
					maKho: 'MK01_1',
					tenkho: 'Kho con 01',
					soKhoCon: 0,
					sanLuongMT: 1250000,
					sanLuongBDMT: 500000,
					nhap: 300000,
					xuat: 60000,
				},
				{
					id: '1_2',
					maKho: 'MK01_2',
					tenkho: 'Kho con 02',
					soKhoCon: 0,
					sanLuongMT: 1250000,
					sanLuongBDMT: 500000,
					nhap: 300000,
					xuat: 60000,
				},
			],
		},
		{
			id: '2',
			maKho: 'MK02',
			tenkho: 'Kho 02',
			soKhoCon: 2,
			sanLuongMT: 1200000,
			sanLuongBDMT: 150000,
			nhap: 1000000,
			xuat: 5000000,
			child: [
				{
					id: '2_1',
					maKho: 'MK02_1',
					tenkho: 'Kho con 02 01',
					soKhoCon: 0,
					sanLuongMT: 1250000,
					sanLuongBDMT: 500000,
					nhap: 300000,
					xuat: 60000,
				},
				{
					id: '2_2',
					maKho: 'MK02_2',
					tenkho: 'Kho con 02 02',
					soKhoCon: 0,
					sanLuongMT: 1250000,
					sanLuongBDMT: 500000,
					nhap: 300000,
					xuat: 60000,
				},
			],
		},
	];

	return (
		<div className={styles.container}>
			<Loading loading={false} />

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
								// onClick={handleExportExcel}
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
								// onClick={() =>
								// 	router.replace(
								// 		{
								// 			pathname: router.pathname,
								// 			query: {
								// 				...router.query,
								// 				importExcel: 'open',
								// 			},
								// 		},
								// 		undefined,
								// 		{
								// 			scroll: false,
								// 			shallow: false,
								// 		}
								// 	)
								// }
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
								// onClick={() => setOpenCreate(true)}
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
				<div className={styles.control}>
					<div className={styles.left}>
						<div style={{minWidth: 360}}>
							<Search keyName='_keyword' placeholder='Tìm kiếm theo tên hoặc mã' />
						</div>

						<div style={{minWidth: 240}}>
							<FilterCustom
								name='Trạng thái'
								query='_status'
								listFilter={[
									{
										id: STATUS_GENERAL.SU_DUNG,
										name: 'Sử dụng',
									},
									{
										id: STATUS_GENERAL.KHONG_SU_DUNG,
										name: 'Không sử dụng',
									},
								]}
							/>
						</div>
					</div>
					<div></div>
				</div>
				<div className={styles.table}>
					<DataWrapper
						data={[1, 2, 3]}
						loading={false}
						noti={<Noti des='Hiện tại chưa có khu vực nào ?' titleButton='Thêm khu vực' />}
					>
						<TableDropDown
							keyChild='child'
							keyUuid='id'
							data={data}
							listLable={[
								{
									key: '',
									title: '',
								},
								{
									key: 'maKho',
									title: 'ID khu vực',
								},
								{
									key: 'tenkho',
									title: 'Tên khu vực',
								},
								{
									key: 'soKhoCon',
									title: 'Khu vực con',
								},
								{
									key: 'sanLuongBDMT',
									title: 'Số lượng team',
								},
								{
									key: 'soKhoCon',
									title: 'Số thiết bị',
								},
								{
									key: 'sanLuongMT',
									title: 'Địa chỉ',
								},
								{
									key: 'soKhoCon',
									title: 'Ngày tạo',
								},
								{
									key: 'tacvu',
									title: 'Tác vụ',
								},
							]}
						/>
					</DataWrapper>
					<Pagination
						currentPage={Number(_page) || 1}
						total={100}
						pageSize={Number(_pageSize) || 20}
						dependencies={[_pageSize, _keyword, _status]}
					/>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainFactoryArea;
