import React, {useState} from 'react';

import {IDetailGateway, PropsTableInforGateway} from './interfaces';
import styles from './TableInforGateway.module.scss';

import Button from '~/components/common/Button';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, STATE_GATEWAY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import Moment from 'react-moment';
import Dialog from '~/components/common/Dialog';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import PopupUpdateGateway from '../PopupUpdateGateway';
import i18n from '~/locale/i18n';

function TableInforGateway({}: PropsTableInforGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [data, setData] = useState<IDetailGateway>();
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [dataUpdate, setDataUpdate] = useState<any>(null);

	useQuery([QUERY_KEY.chi_tiet_gateway, _id], {
		queryFn: () =>
			httpRequest({
				http: gatewayServices.detailGateway({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setData(data);
		},
		enabled: !!_id,
	});

	const funcChangeStatusGateway = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Common.Changestatussuccessfully'),
				http: gatewayServices.updateStatusGateway({
					uuid: data?.uuid!,
					status: data?.status == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenDelete(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_gateway, _id]);
			}
		},
	});

	const handleChangeStatusGateway = async () => {
		if (!data?.uuid) {
			return toastWarn({msg: i18n.t('Gateway.GatwayNotFound')});
		}

		return funcChangeStatusGateway.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatusGateway.isLoading} />
			<div className={styles.header}>
				<Link href={PATH.Gateway} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>{i18n.t('Gateway.GatewayInformation')}</p>
				</Link>
				<div className={styles.list_btn}>
					{data?.status == STATUS_GENERAL.SU_DUNG && (
						<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold onClick={() => setOpenDelete(true)}>
							{i18n.t('Common.Lock')}
						</Button>
					)}

					{data?.status == STATUS_GENERAL.KHONG_SU_DUNG && (
						<Button className={styles.btn} rounded_8 w_fit p_6_16 green bold onClick={() => setOpenDelete(true)}>
							{i18n.t('Common.Unlock')}
						</Button>
					)}

					<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold onClick={() => setDataUpdate(data)}>
						{i18n.t('Common.Edit')}
					</Button>
				</div>
			</div>
			<div className={clsx('mt')}>
				<table className={styles.containertable}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.GatewayID')}: </span>
							{data?.code}
						</td>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.WorkGateway')}: </span>
							<span style={{color: data?.state == STATE_GATEWAY.ONLINE ? '#2CAE39' : '#EB2E2E'}}>
								{data?.state == STATE_GATEWAY.ONLINE ? 'Online' : 'Offline'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.NameGateway')}: </span> {data?.name}
						</td>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.LastOnline')}: </span>{' '}
							{data?.timeLastOnline ? <Moment date={data?.timeLastOnline} format='HH:mm, DD/MM/YYYY' /> : '---'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.StatusGatewayUsed')}: </span>
							<span style={{color: data?.status == STATUS_GENERAL.SU_DUNG ? '#2CAE39' : '#EB2E2E'}}>
								{data?.status == STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Using') : i18n.t('Common.Donotuse')}
							</span>
						</td>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.AreaManageGateway')}: </span>{' '}
							<span>{data?.factoryName || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Common.NumberofDeviceCurrentlyConnected')}:</span>{' '}
							<span style={{color: '#3772FF'}}>{data?.connection}</span>
						</td>
						<td rowSpan={4} className={styles.description}>
							<span style={{marginRight: '4px'}}>{i18n.t('Common.Note')}:</span>
							{data?.notes || '---'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>{i18n.t('Gateway.ConnectingIP')}: </span>
							<span style={{color: '#3772FF'}}>{data?.ipConnect || '---'}</span>
						</td>
					</tr>
				</table>
			</div>
			<Dialog
				warn
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title={i18n.t('Common.Changestatus')}
				note={i18n.t('Gateway.AreYouSureYouWantToChangeTheStatusOfThisGateway')}
				onSubmit={handleChangeStatusGateway}
			/>

			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<PopupUpdateGateway dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
		</div>
	);
}

export default TableInforGateway;
