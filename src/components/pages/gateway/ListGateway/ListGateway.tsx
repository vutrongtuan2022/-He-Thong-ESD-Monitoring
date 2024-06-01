import React, {useState} from 'react';
import {IGateway, PropsListGateway} from './interfaces';
import styles from './ListGateway.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {Lock1, Unlock} from 'iconsax-react';
import Link from 'next/link';
import Dialog from '~/components/common/Dialog';
import {QUERY_KEY, STATE_GATEWAY, STATUS_GENERAL} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import gatewayServices from '~/services/gatewayServices';
import Moment from 'react-moment';
import StateGateway from '../StateGateway';
import IconCustom from '~/components/common/IconCustom';
import Popup from '~/components/common/Popup';
import PopupUpdateGateway from '../PopupUpdateGateway';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import {LuPencil} from 'react-icons/lu';
import i18n from '~/locale/i18n';

function ListGateway({onOpenCreate}: PropsListGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _state, _status, _factoryAreaUuid} = router.query;

	const [dataUpdate, setDataUpdate] = useState<IGateway | null>(null);
	const [dataChange, setDataChange] = useState<IGateway | null>(null);

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
	const listGateways = useQuery([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid], {
		queryFn: () =>
			httpRequest({
				http: gatewayServices.listGateway({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					state: _state ? Number(_state) : null,
					factoryAreaUuid: (_factoryAreaUuid as string) || '',
					status: _status ? Number(_status) : null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcChangeStatus = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.ThaydoiTrangthaithanhcong'),
				http: gatewayServices.updateStatusGateway({
					uuid: dataChange?.uuid!,
					status: dataChange?.status == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid]);
				setDataChange(null);
			}
		},
	});

	const handleChangeStatusGateway = async () => {
		if (!dataChange?.uuid) {
			return toastWarn({msg: i18n.t('Gateway.Khongtimthaygateway')});
		}

		return funcChangeStatus.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatus.isLoading} />
			<div className={styles.control}>
				<div className={styles.left}>
					<div style={{minWidth: 360}}>
						<Search keyName='_keyword' placeholder={i18n.t('Gateway.Timkiemthemgatewayid')} />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							isSearch
							name={i18n.t('Common.Regency')}
							query='_factoryAreaUuid'
							listFilter={listAreas?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							name={i18n.t('Common.Hoatdong')}
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
							name={i18n.t('Common.Status')}
							query='_status'
							listFilter={[
								{
									id: STATUS_GENERAL.SU_DUNG,
									name: i18n.t('Common.Use'),
								},
								{
									id: STATUS_GENERAL.KHONG_SU_DUNG,
									name: i18n.t('Common.Donotuse'),
								},
							]}
						/>
					</div>
				</div>
				<div></div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listGateways?.data?.items}
					loading={listGateways?.isLoading}
					noti={
						<Noti
							des={i18n.t('Gateway.Hientaichuacogateway')}
							titleButton={i18n.t('Gateway.Themgateway')}
							onClick={onOpenCreate}
						/>
					}
				>
					<Table
						data={listGateways?.data?.items}
						column={[
							{
								title: i18n.t('Common.STT'),
								render: (data: IGateway, index: number) => <>{index + 1}</>,
							},

							{
								title: i18n.t('Gateway.Idgateway'),
								render: (data: IGateway) => (
									<Link href={`/gateway/${data.uuid}`} className={styles.link}>
										{data.code}
									</Link>
								),
							},
							{
								title: i18n.t('Gateway.Tengateway'),
								render: (data: IGateway) => <p>{data.name || '---'}</p>,
							},
							{
								title: i18n.t('Common.Khuvucquanly'),
								render: (data: IGateway) => <p>{data.factoryName || '---'}</p>,
							},
							{
								title: i18n.t('Common.Slbophatdangketnoi'),
								render: (data: IGateway) => <>{data.connection}</>,
							},
							{
								title: i18n.t('Common.Hoatdong'),
								render: (data: IGateway) => <StateGateway state={data.state} />,
							},
							{
								title: i18n.t('Common.Status'),
								render: (data: IGateway) => (
									<>
										{data?.status == STATUS_GENERAL.SU_DUNG ? (
											<p style={{color: '#35C244', fontWeight: 600}}>{i18n.t('Common.Using')}</p>
										) : data.status == STATUS_GENERAL.KHONG_SU_DUNG ? (
											<p style={{color: '#E85A5A', fontWeight: 600}}>{i18n.t('Common.Donotuse')}</p>
										) : (
											'---'
										)}
									</>
								),
							},
							{
								title: i18n.t('Common.Onlinelancuoi'),
								render: (data: IGateway) =>
									data.timeLastOnline ? <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: i18n.t('Common.Action'),
								render: (data: IGateway) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip={i18n.t('Common.Chinhsua')}
											color='#777E90'
											onClick={() => setDataUpdate(data)}
										/>

										<IconCustom
											warn
											icon={data.status === STATUS_GENERAL.SU_DUNG ? <Lock1 size='22' /> : <Unlock size='22' />}
											tooltip={
												data.status === STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Khoa') : i18n.t('Common.Mokhoa')
											}
											color='#777E90'
											onClick={() => setDataChange(data)}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listGateways?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _state, _status, _factoryAreaUuid]}
				/>
				<Dialog
					warn
					open={!!dataChange}
					onClose={() => setDataChange(null)}
					title={i18n.t('Common.ChuyenTrangthai')}
					note={i18n.t('Gateway.BancochacmuonchuyenTrangthaichogatewaynay')}
					onSubmit={handleChangeStatusGateway}
				/>
				<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
					<PopupUpdateGateway dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
				</Popup>
			</div>
		</div>
	);
}

export default ListGateway;
