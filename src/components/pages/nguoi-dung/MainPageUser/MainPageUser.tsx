import React, {useState} from 'react';
import {IAccount, PropsMainPageUser} from './interfaces';
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
import IconCustom from '~/components/common/IconCustom';
import StateAccount from '../StateAccount';

const MainPageUser = ({}: PropsMainPageUser) => {
	const router = useRouter();
	const {_page, _pageSize, _keyword, _manager, _dateFrom, _dateTo} = router.query;
	const [openClock, setOpenClock] = useState<boolean>(false);

	const [open, setOpen] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};
	// const listUser = useQuery([QUERY_KEY.danh_sach_nhan_vien, _page, _username, _pageSize, _keyword, _status, _teamUuid], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			http: userServices.listUser({
	// 				pageSize: Number(_pageSize) || 20,
	// 				page: Number(_page) || 1,
	// 				keyword: _keyword ? (_keyword as string) : '',
	// 				username: _username ? (_username as string) : null,
	// 				status: _status ? (_status as string) : null,
	// 				timeCreated: null,
	// 				teamUuid: '',
	// 			}),
	// 		}),
	// 	select(data) {
	// 		return data;
	// 	},
	// });
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý tài khoản',
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
								query='_onlineState'
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
									render: (data: any) => <>nv01</>,
								},
								{
									title: 'Tên người dùng',
									render: (data: any) => (
										<Link href={`/nguoi-dung/{123}}`} className={styles.DetailUser}>
											jhagjdsyu
										</Link>
									),
								},
								{
									title: 'Email',
									render: (data: any) => <>skdjsdj@gmail.com</>,
								},
								{
									title: 'Số điện thoại',
									render: (data: any) => <>0942040214</>,
								},
								{
									title: 'Chức vụ',
									render: (data: any) => <>Giám đốc</>,
								},
								{
									title: 'Vai trò',
									render: (data: any) => <>Admin</>,
								},
								{
									title: 'Trạng thái',
									render: (data: any) => <Status status='Online' />,
									// render: (data: any) => <StateAccount />,
								},
								{
									title: '',
									render: (data: any) => (
										<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
											<IconCustom
												edit
												icon={<CiLock fontSize={20} fontWeight={600} />}
												tooltip=' Khoa lai '
												color='#777E90'
												onClick={() => setOpenClock(true)}
												// onClick={() => {
												// 	router.push(`/nguoi-dung/chinh-sua?_id=${123}`);
												// }}
											/>
											<IconCustom
												edit
												icon={<LuPencil fontSize={20} fontWeight={600} />}
												tooltip='Chỉnh sửa'
												color='#777E90'
												onClick={() => {
													router.push(`/nguoi-dung/chinh-sua?_id=${123}`);
												}}
											/>
										</div>
									),
								},
							]}
						/>
						<Dialog
							danger
							open={openClock}
							onClose={() => setOpenClock(false)}
							title='Khóa Người Dùng'
							note='Bạn có chắc chắn muốn khóa người dùng này?'
							onSubmit={() => setOpenClock(false)}
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
