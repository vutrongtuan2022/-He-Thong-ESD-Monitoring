import React, {useState} from 'react';
import Image from 'next/image';

import {PropsMainTransmitter} from './interfaces';
import styles from './MainTransmitter.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import Status from '~/components/common/Status';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Popup from '~/components/common/Popup';
import FormCreateTransmitter from '../FormCreateTransmitter';
import FormUpdateTransmitter from '../FormUpdateTransmitter';
import Link from 'next/link';

function MainTransmitter({}: PropsMainTransmitter) {
	const router = useRouter();
	const {_page, _pageSize, _keyword, _manager, _dateFrom, _dateTo} = router.query;

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
						title: 'Quản lý bộ phát',
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
									{id: 1, name: 'Online'},
									{id: 2, name: 'Offline'},
								]}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Team'
								query='_team'
								listFilter={[
									{id: 1, name: 'Team 1'},
									{id: 2, name: 'Team 2'},
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
										title: 'Số MAC',
										render: (data: any) => (
											<Link href={`/bo-phat/6478384343`} className={styles.link}>
												6478384343
											</Link>
										),
									},
									{
										title: 'Tên thiết bị',
										render: (data: any) => <>Thiết bị số 3</>,
									},
									{
										title: 'Thuộc team',
										render: (data: any) => <>Team của Dương Minh Nghĩa</>,
									},
									{
										title: 'Leader team',
										render: (data: any) => <>Dương Minh Nghĩa</>,
									},
									{
										title: 'Phần trăm pin',
										render: (data: any) => <>15%</>,
									},
									{
										title: 'Trạng thái',
										render: (data: any) => <Status status='Online' />,
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
							<Pagination
								currentPage={Number(_page) || 1}
								total={400}
								pageSize={Number(_pageSize) || 20}
								dependencies={[_pageSize, _keyword, _manager, _dateFrom, _dateTo]}
							/>
						</DataWrapper>
					</div>
				</div>
			</WrapperContainer>

			{/* POPUP */}
			<Dialog
				danger
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title='Xóa bộ phát'
				note='Bạn có chắc chắn muốn xóa bộ phát này?'
				onSubmit={() => setOpenDelete(false)}
			/>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<FormCreateTransmitter onClose={() => setOpenCreate(false)} />
			</Popup>
			<Popup open={openUpdate} onClose={() => setOpenUpdate(false)}>
				<FormUpdateTransmitter onClose={() => setOpenUpdate(false)} />
			</Popup>
		</div>
	);
}

export default MainTransmitter;
