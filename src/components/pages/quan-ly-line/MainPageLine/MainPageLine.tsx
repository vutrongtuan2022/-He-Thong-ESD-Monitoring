import React, {useState} from 'react';
import Image from 'next/image';

import {PropsMainPageLine} from './interfaces';
import styles from './MainPageLine.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Link from 'next/link';
import Status from '~/components/common/Status';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';
import Pagination from '~/components/common/Pagination';

function MainPageLine({}: PropsMainPageLine) {
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [openUpdate, setOpenUpdate] = useState<boolean>(false);

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý line',
						path: '',
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
								onClick={() => setOpenCreate(true)}
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
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search placeholder='Tìm kiếm theo số MAC, tên thiết bị' />
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Trạng thái'
								query='_status'
								listFilter={[
									{id: 1, name: 'Đang hoạt động'},
									{id: 2, name: 'Không hoạt động'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Vị trí'
								query='_position'
								listFilter={[
									{id: 1, name: 'Bên trái'},
									{id: 2, name: 'Bên phải'},
								]}
							/>
						</div>
					</div>
					<div className={styles.table}>
						<DataWrapper data={[1, 2, 3]} loading={false}>
							<Table
								data={[1, 2, 3]}
								column={[
									{
										title: 'STT',
										render: (data: any, index: number) => <>{index + 1}</>,
									},
									{
										title: 'Tên line',
										render: (data: any) => (
											<Link href={`/quan-ly-line/6478384343`} className={styles.link}>
												Line 1
											</Link>
										),
									},
									{
										title: 'Số nhân viên thuộc line',
										render: (data: any) => <>3</>,
									},
									{
										title: 'Tổng vị trí trong line',
										render: (data: any) => <>5</>,
									},
									{
										title: 'Online lần cuối',
										render: (data: any) => (
											<Moment
												date={'Fri May 17 2024 09:49:15 GMT+0700 (Indochina Time)'}
												format='HH:mm, DD/MM/YYYY'
											/>
										),
									},
									{
										title: 'Trạng thái',
										render: (data: any) => <Status status='Online' />,
									},
									{
										title: 'Tác vụ',
										render: (data: any) => (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													edit
													icon={<LuPencil fontSize={20} fontWeight={600} />}
													tooltip='Chỉnh sửa'
													color='#777E90'
													onClick={() => setOpenUpdate(true)}
												/>

												<IconCustom
													delete
													icon={<Trash size='22' />}
													tooltip='Xóa'
													color='#777E90'
													onClick={() => setOpenDelete(true)}
												/>
											</div>
										),
									},
								]}
							/>
						</DataWrapper>
						<Pagination currentPage={1} total={400} pageSize={20} dependencies={[]} />
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainPageLine;
