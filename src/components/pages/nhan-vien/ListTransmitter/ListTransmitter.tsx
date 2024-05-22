import React, {useEffect, useState} from 'react';
import Status from '~/components/common/Status';
import {IUser, PropsListTransmitter} from './interfaces';
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

import {Trash} from 'iconsax-react';
import {BsThreeDots} from 'react-icons/bs';
import Link from 'next/link';
import {AiOutlineUserAdd} from 'react-icons/ai';
import PopupCreate from '../PopupCreate';
import Popup from '~/components/common/Popup';
import Dialog from '~/components/common/Dialog';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATUS_USER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import clsx from 'clsx';

function ListTransmitter({}: PropsListTransmitter) {
	const router = useRouter();

	const {_page, _pageSize, _status, _username, _keyword, _teamUuid} = router.query;

	const [OpenCreate, setOpenCreate] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [data, setData] = useState<any[]>([]);
	const [open, setOpen] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};

	const listUser = useQuery([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _keyword, _status, _teamUuid], {
		queryFn: () =>
			httpRequest({
				http: userServices.listUser({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					username: _username ? (_username as string) : null,
					status: _status ? (_status as string) : null,
					timeCreated: {
						fromDate: '2023-05-21T02:36:42.699Z',
						toDate: '2024-05-21T02:36:42.699Z',
					},
					teamUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});
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
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên nhân viên, mã nhân viên' />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: STATUS_USER.HAVEACCOUNT,
									name: 'Có tài khoản',
								},
								{
									id: STATUS_USER.NOACCOUNT,
									name: 'Không có tài khoản',
								},
							]}
							name='Trạng thái'
							query='_username'
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: 1,
									name: ' Chức vụ 1',
								},
								{
									id: 2,
									name: ' Chức vụ 2',
								},
							]}
							name='Chức vụ'
							query='_electric'
						/>
					</div>
				</div>
				<div></div>
			</div>
			<div className={styles.table}>
				<DataWrapper data={listUser?.data?.items} loading={false} noti={<Noti des='Hiện tại chưa có bộ phát nào ?' />}>
					<Table
						data={listUser?.data?.items}
						onSetData={setData}
						column={[
							{
								// checkBox: true,
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},

							{
								title: 'Mã nhân viên',
								render: (data: IUser) => (
									<Link href={`/nhan-vien/${data.uuid}`} className={styles.link}>
										{data.code || '---'}
									</Link>
								),
							},
							{
								title: 'Tên nhân viên',
								render: (data: IUser) => <p>{data.fullname}</p>,
							},
							{
								title: 'Chức vụ',
								render: (data: IUser) => <p>{data.role || '---'}</p>,
							},
							{
								title: 'Thuộc team',
								render: (data: IUser) => <p>{data.teamName || '---'}</p>,
							},
							{
								title: 'Leader team',
								render: (data: IUser) => <>{data.leadName || '---'}</>,
							},
							{
								title: 'Tài khoản',
								render: (data: IUser) => (
									<p
										className={clsx(styles.status, {
											[styles.haveaccount]: data.userName !== '',
											[styles.noaccount]: data.userName === '',
										})}
									>
										{data.userName !== '' ? 'Đã cấp' : 'Chưa cấp'}
									</p>
								),
							},

							{
								title: 'Ngày tạo',
								render: (data: IUser) => <>{data.timeCreated || '---'}</>,
							},
							{
								title: '',
								render: (data: IUser, index: number) => (
									<HeadlessTippy
										interactive
										visible={open === index}
										placement='bottom'
										render={(attrs) => (
											<div className={styles.mainOption}>
												<div
													className={styles.item}
													onClick={() => {
														setOpenCreate(true);
														setOpen(null);
													}}
												>
													<AiOutlineUserAdd size={18} />
													<p>Cấp tài khoản</p>
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
					total={listUser?.data?.pagination.totalCount || 0}
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
