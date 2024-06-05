import React, {Fragment, useState} from 'react';
import {IDataDetailDevice, PropsInfoDevice} from './interfaces';
import styles from './InfoDevice.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import Dialog from '~/components/common/Dialog';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, SIGNAL_STATUS_DEVICE, STATE_DEVICE_NG, STATE_ONLINE_DEVICE, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import PopupAssignDevice from '../PopupAssignDevice';
import i18n from '~/locale/i18n';
import Moment from 'react-moment';

function InfoDevice({}: PropsInfoDevice) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [data, setData] = useState<IDataDetailDevice>();

	const [openCancel, setOpenCancel] = useState<boolean>(false);
	const [openAssign, setOpenAssign] = useState<boolean>(false);

	useQuery([QUERY_KEY.chi_tiet_bo_phat, _id], {
		queryFn: () =>
			httpRequest({
				http: deviceServices.detailDevice({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setData(data);
		},
		enabled: !!_id,
	});

	const cancelTeamUsing = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Device.UsageRightsRevokedSuccessfully'),
				http: deviceServices.updateTeamUsing({
					uuid: data?.uuid!,
					teamUuid: null,
					note: '',
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenCancel(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_bo_phat, _id]);
			}
		},
	});

	const handleCancel = async () => {
		if (!data?.uuid) {
			return toastWarn({msg: i18n.t('Device.DeviceNotFound')});
		}

		return cancelTeamUsing.mutate();
	};

	return (
		<Fragment>
			<Loading loading={cancelTeamUsing.isLoading} />
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.Device} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>{i18n.t('Device.TransmitterInformation')}</p>
					</Link>
					<div className={styles.list_btn}>
						{data?.teamUuid ? (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold onClick={() => setOpenCancel(true)}>
								{i18n.t('Device.RevokeUsageRights')}
							</Button>
						) : (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold onClick={() => setOpenAssign(true)}>
								{i18n.t('Device.GrantUsageRights')}
							</Button>
						)}
					</div>
				</div>
				<div className={'mt'}>
					<table className={styles.containertable}>
						<colgroup>
							<col style={{width: '50%'}} />
							<col style={{width: '50%'}} />
						</colgroup>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.DeviceMacAddress')} </span>
								{data?.macNumber}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.BelongToTeam')}: </span> {data?.teamName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6, whiteSpace: 'pre'}}>{i18n.t('Device.DeviceName')} : </span> {data?.name}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Team.IDTeam')}: </span> {data?.codeTeam || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.CurrentElectrostaticValue')}:</span>{' '}
								{data?.edsStatic || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.LeaderTeam')}: </span>
								<span style={{color: '#4484FF'}}>{data?.teamLeaderName || '---'}</span>
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.GatewayConnected')}: </span>
								{data?.gatewayName || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.SignalStatus')}: </span>
								{data?.signalStatus == SIGNAL_STATUS_DEVICE.MANH
									? i18n.t('Device.Strong')
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.TRUNG_BINH
									? i18n.t('Device.Average')
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.YEU
									? i18n.t('Device.Weak')
									: '---'}
							</td>
						</tr>

						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.StatusDeviceUsed')}: </span>
								<span>{data?.status == STATUS_GENERAL.SU_DUNG ? i18n.t('Common.Using') : i18n.t('Common.Donotuse')}</span>
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.Condition')}: </span>
								<span style={{color: data?.ngStatus! == STATE_DEVICE_NG.KHONG_NG ? '#2CAE39' : '#EB2E2E'}}>
									{data?.ngStatus && data?.ngStatus == STATE_DEVICE_NG.KHONG_NG
										? i18n.t('Device.Normal')
										: data?.ngStatus && data?.ngStatus == STATE_DEVICE_NG.BI_NG
										? 'NG'
										: '---'}
								</span>
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.BatteryPercentage')}: </span> {data?.battery}%
							</td>
							<td rowSpan={5} className={styles.description}>
								<span style={{marginRight: 6}}>{i18n.t('Common.Note')}:</span>
								{data?.notes || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.OperatingStatus')}: </span>
								<span style={{color: data?.state == STATE_ONLINE_DEVICE.ONLINE ? '#2CAE39' : '#EB2E2E'}}>
									{data?.state == STATE_ONLINE_DEVICE.ONLINE
										? 'Onine'
										: data?.state == STATE_ONLINE_DEVICE.OFFLINE
										? 'Offline'
										: '---'}
								</span>
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.LastOnline')}: </span>
								<span>
									{data?.timeLastOnline ? <Moment date={data.timeLastOnline} format='HH:mm, DD/MM/YYYY' /> : '---'}
								</span>
							</td>
						</tr>
					</table>
				</div>
			</div>

			{/* POPUP */}
			<Dialog
				danger
				open={openCancel}
				onClose={() => setOpenCancel(false)}
				title={i18n.t('Device.RevokeUsageRights')}
				note={i18n.t('Common.AreYouSureYouWantToRevokeTheUsageRightsForThisDevice')}
				onSubmit={handleCancel}
			/>

			<Popup open={openAssign} onClose={() => setOpenAssign(false)}>
				<PopupAssignDevice onClose={() => setOpenAssign(false)} />
			</Popup>
		</Fragment>
	);
}

export default InfoDevice;
