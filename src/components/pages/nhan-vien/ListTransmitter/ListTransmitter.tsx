import React, {useEffect, useState} from 'react';
import Status from '~/components/common/Status';
import {PropsListTransmitter} from './interfaces';
import styles from './ListTransmitter.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {LuCheck, LuPencil} from 'react-icons/lu';
import Button from '~/components/common/Button';
import HeadlessTippy from '@tippyjs/react/headless';
import {CiLock} from 'react-icons/ci';
import {Trash} from 'iconsax-react';
import {BsThreeDots} from 'react-icons/bs';
import Link from 'next/link';
import {AiOutlineUserAdd} from 'react-icons/ai';
import PopupCreate from '../PopupCreate';
import Popup from '~/components/common/Popup';
import Dialog from '~/components/common/Dialog';

function ListTransmitter({}: PropsListTransmitter) {
	const router = useRouter();
	const [OpenCreate, setOpenCreate] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const {_page, _pageSize, _keyword} = router.query;
	const [data, setData] = useState<any[]>([]);
	const [open, setOpen] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};
	useEffect(() => {
		setData([
			{
				id: 1,
				name: 'name 1',
				index: 0,
				isChecked: false,
			},
			{
				id: 2,
				name: 'name 2',
				index: 1,
				isChecked: false,
			},
			{
				id: 3,
				name: 'name 3',
				index: 2,
				isChecked: false,
			},
		]);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.control}>
				<div className={styles.left}>
					{data?.some((x) => x.isChecked !== false) && (
						<div>
							<Button className={styles.btn} rounded_8 w_fit icon={<LuCheck size={20} />}>
								Xác nhận xử lý
							</Button>
						</div>
					)}
					<div style={{minWidth: 360}}>
						<Search placeholder='Tìm kiếm theo tên nhân viên, mã nhân viên' />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: 1,
									name: ' Trạng thái 1',
								},
								{
									id: 2,
									name: ' Trạng thái 2',
								},
							]}
							name='Trạng thái'
							query='_electric'
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: 1,
									name: ' Vị trí 1',
								},
								{
									id: 2,
									name: ' Vị trí 2',
								},
							]}
							name='Vị trí'
							query='_electric'
						/>
					</div>
				</div>
				<div></div>
			</div>
			<div className={styles.table}>
				<DataWrapper data={[1, 2, 3]} loading={false} noti={<Noti des='Hiện tại chưa có bộ phát nào ?' />}>
					<Table
						data={data}
						onSetData={setData}
						column={[
							{
								checkBox: true,
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},

							{
								title: 'Mã nhân viên',
								render: (data: any) => (
									<Link href={`/nhan-vien/6478384343`} className={styles.link}>
										6478384343
									</Link>
								),
							},
							{
								title: 'Tên nhân viên',
								render: (data: any) => <p>Nguyễn Thị E</p>,
							},
							{
								title: 'Chức vụ',
								render: (data: any) => <p>Quản lý</p>,
							},
							{
								title: 'Thuộc team',
								render: (data: any) => <p>Team sản xuất Nguyễn Văn A</p>,
							},
							{
								title: 'Leader team',
								render: (data: any) => <>Nguyễn Văn A</>,
							},
							{
								title: 'Tài khoản',
								render: (data: any) => <Status status='Online' />,
							},
							{
								title: 'Ngày tạo',
								render: (data: any) => <>10/04/2024, 14:09:39</>,
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
												<div className={styles.item} onClick={() => setOpenCreate(true)}>
													<AiOutlineUserAdd size={18} />
													<p>Thêm tài khoản</p>
												</div>
												<div
													className={styles.item}
													onClick={() => {
														router.push(`/nhan-vien/chinh-sua?_id=${123}`);
													}}
												>
													<LuPencil size={18} />
													<p>Chỉnh sửa</p>
												</div>
												<div className={styles.item} onClick={() => setOpenDelete(true)}>
													<Trash size={18} />
													<p>Xóa bỏ</p>
												</div>
											</div>
										)}
										onClickOutside={() => setOpen(null)}
									>
										<div className={styles.btn} onClick={() => handleToggle(index)}>
											<BsThreeDots className={styles.dots} size={20} />
										</div>
									</HeadlessTippy>
								),
							},
						]}
					/>
				</DataWrapper>
				<Dialog
					danger
					open={openDelete}
					onClose={() => setOpenDelete(false)}
					title='Xóa nhân viên'
					note='Bạn có chắc chắn muốn xóa nhân viên này?'
					onSubmit={() => setOpenDelete(false)}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					total={400}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword]}
				/>
			</div>
			<Popup open={OpenCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreate onClose={() => setOpenCreate(false)} />
			</Popup>
		</div>
	);
}

export default ListTransmitter;
