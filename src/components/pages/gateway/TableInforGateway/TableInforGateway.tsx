import React, {useState} from 'react';

import {IDetailGateway, PropsTableInforGateway} from './interfaces';
import styles from './TableInforGateway.module.scss';

import Button from '~/components/common/Button';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import clsx from 'clsx';
import {PATH} from '~/constants/config';
import {useRouter} from 'next/router';
import {useMutation, useQuery} from '@tanstack/react-query';
import {QUERY_KEY, STATE_GATEWAY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import Moment from 'react-moment';
import Dialog from '~/components/common/Dialog';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Popup from '~/components/common/Popup';
import PopupUpdateGateway from '../PopupUpdateGateway';

function TableInforGateway({}: PropsTableInforGateway) {
	const router = useRouter();

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

	const funcDeleteGateway = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xóa gateway thành công!',
				http: gatewayServices.updateStatusGateway({
					uuid: data?.uuid!,
					status: data?.status == STATUS_GENERAL.SU_DUNG ? STATUS_GENERAL.KHONG_SU_DUNG : STATUS_GENERAL.SU_DUNG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setOpenDelete(false);
				router.replace(PATH.Gateway, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
	});

	const deleteGateway = async () => {
		if (!data?.uuid) {
			return toastWarn({msg: 'Không tìm thấy gateway!'});
		}

		return funcDeleteGateway.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcDeleteGateway.isLoading} />
			<div className={styles.header}>
				<Link href={PATH.Gateway} className={styles.header_title}>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Thông tin gateway</p>
				</Link>
				<div className={styles.list_btn}>
					<Button className={styles.btn} rounded_8 w_fit p_6_16 danger_opacity bold onClick={() => setOpenDelete(true)}>
						Xóa
					</Button>
					<Button className={styles.btn} rounded_8 w_fit p_6_16 blue_light bold onClick={() => setDataUpdate(data)}>
						Chỉnh sửa
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
							<span style={{marginRight: '4px'}}>Code thiết bị: </span>
							{data?.code}
						</td>
						<td>
							<span style={{marginRight: '4px'}}>Trạng thái: </span>{' '}
							{data?.state == STATE_GATEWAY.ONLINE ? 'Online' : 'Offline'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>Tên gateway: </span> {data?.name}
						</td>
						<td>
							<span style={{marginRight: '4px'}}>Online lần cuối: </span>{' '}
							{data?.timeLastOnline ? <Moment date={data?.timeLastOnline} format='DD:mm, DD/MM/YYYY' /> : '---'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>Số thiết bị phát đang kết nối:</span> {data?.connection}
						</td>
						<td rowSpan={4} className={styles.description}>
							<span style={{marginRight: '4px'}}>Ghi chú:</span>
							{data?.notes || '---'}
						</td>
					</tr>
					<tr>
						<td>
							<span style={{marginRight: '4px'}}>IP đang kết nối: </span>
							{data?.ipConnect || '---'}
						</td>
					</tr>
				</table>
			</div>
			<Dialog
				danger
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				title='Xóa dữ liệu'
				note='Bạn có chắc chắn muốn xóa gateway này?'
				onSubmit={deleteGateway}
			/>
			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<PopupUpdateGateway dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
		</div>
	);
}

export default TableInforGateway;
