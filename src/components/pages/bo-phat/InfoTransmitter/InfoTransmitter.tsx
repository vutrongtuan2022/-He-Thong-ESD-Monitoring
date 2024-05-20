import React, {Fragment, useState} from 'react';
import Image from 'next/image';
import {IDataDetailDevice, PropsInfoTransmitter} from './interfaces';
import styles from './InfoTransmitter.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import Dialog from '~/components/common/Dialog';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY, SIGNAL_STATUS_DEVICE, STATE_DEVICE_NG, STATE_ONLINE_DEVICE, STATUS_DEVICE} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import deviceServices from '~/services/deviceServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function InfoTransmitter({}: PropsInfoTransmitter) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [data, setData] = useState<IDataDetailDevice>();
	const [openCancel, setOpenCancel] = useState<boolean>(false);

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

	const changeStatusDevice = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi trạng thái thành công!',
				http: deviceServices.updateDeviceStatus({
					uuid: data?.uuid!,
					status: data?.status! == STATUS_DEVICE.SU_DUNG ? STATUS_DEVICE.KHONG_SU_DUNG : STATUS_DEVICE.SU_DUNG,
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
			return toastWarn({msg: 'Không tìm thấy thiết bị!'});
		}

		return changeStatusDevice.mutate();
	};

	return (
		<Fragment>
			<Loading loading={changeStatusDevice.isLoading} />
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href={PATH.BoPhat} className={styles.header_title}>
						<IoArrowBackOutline fontSize={20} fontWeight={600} />
						<p>Thông tin bộ phát</p>
					</Link>
					<div className={styles.list_btn}>
						{data?.status == STATUS_DEVICE.SU_DUNG ? (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold onClick={() => setOpenCancel(true)}>
								Hủy quyền sử dụng
							</Button>
						) : (
							<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold onClick={() => setOpenCancel(true)}>
								Mở quyền sử dụng
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
								<span style={{marginRight: 6}}>Số MAC thiết bị: </span>
								{data?.macNumber}
							</td>
							<td>
								<span style={{marginRight: 6}}>Thuộc team: </span> {data?.teamName ? `Team của ${data?.teamName}` : '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Tên thiết bị: </span> {data?.name}
							</td>
							<td>
								<span style={{marginRight: 6}}>Mã team: </span> {data?.teamName ? `Team của ${data?.teamName}` : '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Giá trị tĩnh điện hiện tại:</span> {data?.edsStatic || '---'}
							</td>
							<td>
								<span style={{marginRight: 6}}>Leader team: </span> {data?.teamName ? `Team của ${data?.teamName}` : '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Phần trăm pin: </span> {data?.battery}%
							</td>
							<td rowSpan={5} className={styles.description}>
								<span style={{marginRight: 6}}>Ghi chú:</span>
								{'---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Gateway đang kết nối: </span>
								{data?.gatewayName}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Trạng thái sóng: </span>
								{data?.signalStatus == SIGNAL_STATUS_DEVICE.MANH
									? 'Mạnh'
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.TRUNG_BINH
									? 'Trung bình'
									: data?.signalStatus == SIGNAL_STATUS_DEVICE.YEU
									? 'Yếu'
									: '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Trạng thái hoạt động: </span>
								{data?.state == STATE_ONLINE_DEVICE.ONLINE
									? 'Onine'
									: data?.state == STATE_ONLINE_DEVICE.OFFLINE
									? 'Offline'
									: '---'}
							</td>
						</tr>
						<tr>
							<td>
								<span style={{marginRight: 6}}>Tình trạng: </span>
								{data?.ngStatus && data?.ngStatus == STATE_DEVICE_NG.KHONG_NG
									? 'Bình thường'
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
				title='Đổi trạng thái'
				note='Bạn có chắc chắn muốn đổi trạng thái bộ phát này?'
				onSubmit={handleCancel}
			/>
		</Fragment>
	);
}

export default InfoTransmitter;
