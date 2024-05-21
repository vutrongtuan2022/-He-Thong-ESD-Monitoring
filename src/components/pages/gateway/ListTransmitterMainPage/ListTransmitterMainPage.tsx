import React, {useEffect, useState} from 'react';
import Status from '~/components/common/Status';
import {IGateway, PropsListTransmitterMainPage} from './interfaces';
import styles from './ListTransmitterMainPage.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {LuCheck, LuPencil} from 'react-icons/lu';
import HeadlessTippy from '@tippyjs/react/headless';
import {CiLock} from 'react-icons/ci';
import {Trash} from 'iconsax-react';
import {BsThreeDots} from 'react-icons/bs';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import {QUERY_KEY, STATE_GATEWAY} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import gatewayServices from '~/services/gatewayServices';
import Moment from 'react-moment';
import StateGateway from '../StateGateway';

function ListTransmitterMainPage({onOpenCreate}: PropsListTransmitterMainPage) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _state, _factoryAreaUuid} = router.query;

	const [open, setOpen] = useState<number | null>(null);
	const [openDelete, setOpenDelete] = useState<boolean>(false);

	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};

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

	// Lấy danh sách gateway
	const listGateways = useQuery([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _factoryAreaUuid], {
		queryFn: () =>
			httpRequest({
				http: gatewayServices.listGateway({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					state: _state ? Number(_state) : null,
					factoryAreaUuid: (_factoryAreaUuid as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.control}>
				<div className={styles.left}>
					<div style={{minWidth: 360}}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên gateway, ID' />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							name='Trạng thái'
							query='_state'
							listFilter={[
								{
									id: STATE_GATEWAY.HOAT_DONG,
									name: 'Hoạt động',
								},
								{
									id: STATE_GATEWAY.KHONG_HOAT_DONG,
									name: 'Không hoạt động',
								},
							]}
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							name='Khu vực'
							query='_factoryAreaUuid'
							listFilter={listAreas?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
				<div></div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listGateways?.data?.items}
					loading={listGateways?.isLoading}
					noti={<Noti des='Hiện tại chưa có gateway nào ?' titleButton='Thêm gateway' onClick={onOpenCreate} />}
				>
					<Table
						data={listGateways?.data?.items}
						column={[
							{
								title: 'STT',
								render: (data: IGateway, index: number) => <>{index + 1}</>,
							},

							{
								title: 'ID gateway',
								render: (data: IGateway) => (
									<Link href={`/gateway/${data.uuid}`} className={styles.link}>
										{data.code}
									</Link>
								),
							},

							{
								title: 'Tên gateway',
								render: (data: IGateway) => <p>{data.name}</p>,
							},
							{
								title: 'SL bộ phát đang kết nối',
								render: (data: IGateway) => <>{data.connection}</>,
							},
							{
								title: 'Trạng thái',
								render: (data: IGateway) => <StateGateway state={data.state} />,
							},
							{
								title: 'Online lần cuối',
								render: (data: IGateway) => <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' />,
							},
							{
								title: '',
								render: (data: IGateway, index: number) => (
									<HeadlessTippy
										interactive
										visible={open === index}
										placement='bottom'
										render={(attrs) => (
											<div className={styles.mainOption}>
												<div className={styles.item}>
													<CiLock size={18} />
													<p>Khóa lại</p>
												</div>
												<div
													className={styles.item}
													onClick={() => {
														router.push(`/nguoi-dung/chinh-sua?_id=${123}`);
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
					<Pagination
						currentPage={Number(_page) || 1}
						total={listGateways?.data?.pagination?.totalCount}
						pageSize={Number(_pageSize) || 20}
						dependencies={[_pageSize, _keyword, _state, _factoryAreaUuid]}
					/>
				</DataWrapper>
				<Dialog
					danger
					open={openDelete}
					onClose={() => setOpenDelete(false)}
					title='Xóa gateway'
					note='Bạn có chắc chắn muốn xóa gateway này?'
					onSubmit={() => setOpenDelete(false)}
				/>
			</div>
		</div>
	);
}

export default ListTransmitterMainPage;
