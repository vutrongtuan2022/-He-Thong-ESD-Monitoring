import React from 'react';
import {PropsListDeviceGateway} from './interfaces';
import styles from './ListDeviceGateway.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import deviceServices from '~/services/deviceServices';
import {IDevice} from '../../bo-phat/MainDevice/interfaces';
import StateDevice from '../../bo-phat/StateDevice';
import Link from 'next/link';
import gatewayServices from '~/services/gatewayServices';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function ListDeviceGateway({}: PropsListDeviceGateway) {
	const router = useRouter();

	const {_id, _team, _page, _pageSize, _keyword} = router.query;

	// GET LIST DROPDOWN
	const listTeams = useQuery([QUERY_KEY.dropdown_danh_sach_team], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listTeam({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	// Lấy danh sách thiết bị
	const listDevices = useQuery([QUERY_KEY.danh_sach_bo_phat, _page, _pageSize, _keyword, _id, _team], {
		queryFn: () =>
			httpRequest({
				http: deviceServices.listDevice({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					gatewayUuid: (_id as string) || '',
					status: null,
					onlineState: null,
					ngState: null,
					battery: null,
					edS_Static: null,
					teamUuid: '',
					factoryAreaUuid: null,
					timeLastOnline: null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	// Func export excel
	const exportGatewayDeviceExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: gatewayServices.exportGatewayDevicecExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					uuid: null,
					gatewayUuid: _id as string,
					status: null,
					teamUuid: _team ? (_team as string) : null,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={exportGatewayDeviceExcel.isLoading} />
			<h4>{i18n.t('Gateway.Danhsachbophatdangketnoi')}</h4>
			<div className={styles.control}>
				<div className={styles.left}>
					<div style={{minWidth: 360}}>
						<Search keyName='_keyword' placeholder={i18n.t('Gateway.Timkiemthemgatewayid')} />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							isSearch
							name='Team'
							query='_team'
							listFilter={listTeams?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
				</div>
				<div>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_4_12
						green
						bold
						icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
						onClick={exportGatewayDeviceExcel.mutate}
					>
						Export excel
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listDevices?.data?.items}
					loading={listDevices?.isLoading}
					noti={
						<Noti disableButton title={i18n.t('Common.Danhsachtrong')} des={i18n.t('Gateway.Danhsachbophatcuagatewaytrong')} />
					}
				>
					<Table
						data={listDevices?.data?.items}
						column={[
							{
								title: i18n.t('Common.STT'),
								render: (data: IDevice, index: number) => <>{index + 1}</>,
							},
							{
								title: i18n.t('Common.SoMAC'),
								render: (data: IDevice) => (
									<Link href={`/bo-phat/${data.uuid}`} className={styles.link}>
										{data.macNumber}
									</Link>
								),
							},
							{
								title: i18n.t('Common.Tenbophat'),
								render: (data: IDevice) => <p>{data.name}</p>,
							},
							{
								title: i18n.t('Common.Teamsudung'),
								render: (data: IDevice) => <p>{data.teamName || '---'}</p>,
							},
							{
								title: i18n.t('Common.Mateam'),
								render: (data: IDevice) => <p>{data.codeTeam || '---'}</p>,
							},
							{
								title: 'Leader team',
								render: (data: IDevice) => <>{data.teamLeaderName || '---'}</>,
							},
							{
								title: i18n.t('Common.Tinhtrang'),
								render: (data: IDevice) => <StateDevice status={data.state} />,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword, _id, _team]}
					total={listDevices?.data?.pagination?.totalCount}
				/>
			</div>
		</div>
	);
}

export default ListDeviceGateway;
