import React, {useState} from 'react';
import {PropsMainPageUser} from './interfaces';
import styles from './MainPageUser.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {BsThreeDots} from 'react-icons/bs';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import clsx from 'clsx';
import Table from '~/components/common/Table';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Status from '~/components/common/Status';
import HeadlessTippy from '@tippyjs/react/headless';
import {LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';
import {CiLock} from 'react-icons/ci';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';

const MainPageUser = ({}: PropsMainPageUser) => {
	const router = useRouter();
	const {_page, _pageSize, _keyword, _manager, _dateFrom, _dateTo} = router.query;
	const [openDelete, setOpenDelete] = useState<boolean>(false);

	const [open, setOpen] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý người dùng',
						path: PATH.NguoiDung,
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
						{/* <div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								primary
								bold
								icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
							>
								Thêm mới
							</Button>
						</div> */}
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.main_search}>
						<div className={styles.search}>
							<Search placeholder='Tìm kiếm theo số MAC, tên thiết bị' />
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='Trạng thái'
								query='_manager'
								listFilter={[
									{id: 1, name: 'Hoạt động'},
									{id: 2, name: 'Đang khóa'},
								]}
							/>
						</div>
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
									title: 'Mã người dùng',
									render: (data: any) => <>ND0001</>,
								},
								{
									title: 'Tên người dùng',
									render: (data: any) => (
										<Link href={`/nguoi-dung/123`} className={styles.DetailUser}>
											Nguyễn Văn A
										</Link>
									),
								},
								{
									title: 'Email',
									render: (data: any) => <>nguyenvana23@gmail.com</>,
								},
								{
									title: 'Số điện thoại',
									render: (data: any) => <>0942040214</>,
								},
								{
									title: 'Chức vụ',
									render: (data: any) => <>Admin</>,
								},
								{
									title: 'Trạng thái',
									render: (data: any) => <Status status='Online' />,
								},
								{
									title: '',
									render: (data: any, index: number) => (
										<HeadlessTippy
											interactive
											visible={open === index}
											placement='bottom'
											render={(attrs) => (
												<div className={styles.mainOption}>
													<div className={styles.item}>
														<CiLock size={18} />
														<p>Khoa lai</p>
													</div>
													<div
														className={styles.item}
														onClick={() => {
															router.push(`/nguoi-dung/chinh-sua?_id=${123}`);
														}}
													>
														<LuPencil size={18} />
														<p>Chinh sua</p>
													</div>
													<div className={styles.item} onClick={() => setOpenDelete(true)}>
														<Trash size={18} />
														<p>Xoa bo</p>
													</div>
												</div>
											)}
											onClickOutside={() => setOpen(null)}
										>
											<div className={styles.btn} onClick={() => handleToggle(index)}>
												<BsThreeDots className={styles.dots} color='#23262f' size={20} />
											</div>
										</HeadlessTippy>
									),
									//<BsThreeDots className={styles.dots} color='#23262f' size={20} />,
								},
							]}
						/>
						<Dialog
							danger
							open={openDelete}
							onClose={() => setOpenDelete(false)}
							title='Xóa Người Dùng'
							note='Bạn có chắc chắn muốn xóa người dùng này?'
							onSubmit={() => setOpenDelete(false)}
						/>
						<Pagination
							currentPage={Number(_page) || 1}
							total={400}
							pageSize={Number(_pageSize) || 20}
							dependencies={[_pageSize, _keyword, _manager, _dateFrom, _dateTo]}
						/>
					</DataWrapper>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default MainPageUser;
