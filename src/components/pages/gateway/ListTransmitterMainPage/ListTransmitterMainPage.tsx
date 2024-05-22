import React, {useState} from 'react';
import {IGateway, PropsListTransmitterMainPage} from './interfaces';
import styles from './ListTransmitterMainPage.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {Trash} from 'iconsax-react';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import {QUERY_KEY, STATE_GATEWAY, STATUS_GATEWAY} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import gatewayServices from '~/services/gatewayServices';
import Moment from 'react-moment';
import StateGateway from '../StateGateway';
import IconCustom from '~/components/common/IconCustom';
import Popup from '~/components/common/Popup';
import PopupUpdate from '../PopupUpdate';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {LuPencil} from 'react-icons/lu';

function ListTransmitterMainPage({onOpenCreate}: PropsListTransmitterMainPage) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _state, _factoryAreaUuid} = router.query;

	const [dataUpdate, setDataUpdate] = useState<IGateway | null>(null);
	const [dataDelete, setDataDelete] = useState<IGateway | null>(null);

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
					status: STATUS_GATEWAY.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcDeleteGateway = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa gateway thành công!',
				http: gatewayServices.updateStatusGateway({
					uuid: dataDelete?.uuid!,
					status: dataDelete?.status == STATUS_GATEWAY.HOAT_DONG ? STATUS_GATEWAY.KHONG_HOAT_DONG : STATUS_GATEWAY.HOAT_DONG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _factoryAreaUuid]);
				setDataDelete(null);
			}
		},
	});

	const deleteGateway = async () => {
		if (!dataDelete?.uuid) {
			return toastWarn({msg: 'Không tìm thấy gateway!'});
		}

		return funcDeleteGateway.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcDeleteGateway.isLoading} />
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
									id: STATE_GATEWAY.ONLINE,
									name: 'Online',
								},
								{
									id: STATE_GATEWAY.OFFLINE,
									name: 'Offline',
								},
							]}
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							isSearch
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
								render: (data: IGateway) => <p>{data.name || '---'}</p>,
							},
							{
								title: 'Khu vực quản lý',
								render: (data: IGateway) => <p>{data.factoryName || '---'}</p>,
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
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											onClick={() => setDataUpdate(data)}
										/>

										<IconCustom
											delete
											icon={<Trash size='22' />}
											tooltip='Xóa'
											color='#777E90'
											onClick={() => setDataDelete(data)}
										/>
									</div>
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
					open={!!dataDelete}
					onClose={() => setDataDelete(null)}
					title='Xóa dữ liệu'
					note='Bạn có chắc chắn muốn xóa gateway này?'
					onSubmit={deleteGateway}
				/>
				<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
					<PopupUpdate dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
				</Popup>
			</div>
		</div>
	);
}

export default ListTransmitterMainPage;
