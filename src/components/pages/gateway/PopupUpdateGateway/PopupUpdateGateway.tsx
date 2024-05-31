import React, {useEffect, useState} from 'react';
import {PropsPopupUpdateGateway} from './interfaces';
import styles from './PopupUpdateGateway.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function PopupUpdateGateway({dataUpdate, onClose}: PropsPopupUpdateGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid} = router.query;

	const [form, setForm] = useState<{
		uuid: string;
		code: string;
		name: string;
		description: string;
	}>({uuid: '', code: '', name: '', description: ''});

	useEffect(() => {
		if (dataUpdate) {
			setForm({
				uuid: dataUpdate.uuid || '',
				code: dataUpdate.code || '',
				name: dataUpdate.name || '',
				description: dataUpdate.notes || '',
			});
		}
	}, [dataUpdate]);

	const upsertGateway = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa gateway thành công!',
				http: gatewayServices.upsertGateway({
					uuid: form.uuid,
					code: form.code,
					name: form.name,
					notes: form.description,
					status: dataUpdate?.status!,
					state: dataUpdate?.state!,
					connection: dataUpdate?.connection,
					factoryAreaUuid: dataUpdate?.factoryAreaUuid,
					ipConnect: dataUpdate?.ipConnect,
					timeLastOnline: dataUpdate?.timeLastOnline,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_gateway, _id]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid]);
				onClose();
				setForm({
					uuid: '',
					code: '',
					name: '',
					description: '',
				});
			}
		},
	});

	const handleSubmit = async () => {
		if (!form.code) {
			return toastWarn({msg: 'Vui lòng nhập code gateway!'});
		}
		if (!form.name) {
			return toastWarn({msg: 'Vui lòng nhập tên gateway!'});
		}

		return upsertGateway.mutate();
	};

	return (
		<div className={styles.container}>
			<h4>Chỉnh sửa gateway</h4>
			<Loading loading={upsertGateway.isLoading} />
			<Form form={form} setForm={setForm}>
				<Input
					type='text'
					placeholder='Nhập code gateway'
					name='code'
					label={
						<span>
							Code gateway <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<Input
					type='text'
					placeholder='Nhập tên gateway'
					name='name'
					label={
						<span>
							Tên gateway <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<div className={clsx('mt')}>
					<TextArea placeholder='Nhập ghi chú' name='description' label={<span>Ghi chú</span>} blur />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_6 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_6 primary onClick={handleSubmit}>
							Cập nhật
						</Button>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default PopupUpdateGateway;
