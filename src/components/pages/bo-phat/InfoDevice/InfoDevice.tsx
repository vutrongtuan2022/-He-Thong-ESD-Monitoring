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
import {QUERY_KEY, SIGNAL_STATUS_DEVICE, STATE_DEVICE_NG, STATE_ONLINE_DEVICE} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import PopupAssignDevice from '../PopupAssignDevice';
import i18n from '~/locale/i18n';

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
				msgSuccess: i18n.t('Device.huyquyensudungthanhcong'),
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
			return toastWarn({msg: i18n.t('Device.khongtimthaythietbi')});
		}

		return cancelTeamUsing.mutate();
	};

	return (
		<Fragment>
			<Loading loading={cancelTeamUsing.isLoading} />
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.BoPhat} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>{i18n.t('Device.thongtinbophat')}</p>
					</Link>
					<div className={styles.list_btn}>
						{data?.teamUuid ? (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold onClick={() => setOpenCancel(true)}>
								{i18n.t('Device.huyquyensudung')}
							</Button>
						) : (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold onClick={() => setOpenAssign(true)}>
								{i18n.t('Device.moquyensudung')}
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
								<span style={{marginRight: 6}}>{i18n.t('Device.somacthietbi')} </span>
								{data?.macNumber}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Thuocteam')}: </span> {data?.teamName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.tenthietbi')} : </span> {data?.name}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Common.Mateam')}: </span> {data?.codeTeam || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.giatritinhdienhientai')}:</span> {data?.edsStatic || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.leaderteam')}: </span>
								{data?.teamLeaderName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.phantrampin')}: </span> {data?.battery}%
							</td>
							<td rowSpan={5} className={styles.description}>
								<span style={{marginRight: 6}}>{i18n.t('Device.ghichu')}:</span>
								{data?.notes || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.Gatewaydangketnoi')}: </span>
								{data?.gatewayName || '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.trangthaisong')}: </span>
								{data?.signalStatus == SIGNAL_STATUS_DEVICE.MANH
									? i18n.t('Device.manh')
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.TRUNG_BINH
									? i18n.t('Device.trungbinh')
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.YEU
									? i18n.t('Device.yeu')
									: '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.trangthaihoatdong')}: </span>
								{data?.state == STATE_ONLINE_DEVICE.ONLINE
									? 'Onine'
									: data?.state == STATE_ONLINE_DEVICE.OFFLINE
									? 'Offline'
									: '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>{i18n.t('Device.tinhtrang')}: </span>
								{data?.ngStatus && data?.ngStatus == STATE_DEVICE_NG.KHONG_NG
									? i18n.t('Device.binhthuong')
									: data?.ngStatus && data?.ngStatus == STATE_DEVICE_NG.BI_NG
									? 'NG'
									: '---'}
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
				title={i18n.t('Device.huyquyensudung')}
				note={i18n.t('Device.huyquyensudunggateway')}
				onSubmit={handleCancel}
			/>

			<Popup open={openAssign} onClose={() => setOpenAssign(false)}>
				<PopupAssignDevice onClose={() => setOpenAssign(false)} />
			</Popup>
		</Fragment>
	);
}

export default InfoDevice;
