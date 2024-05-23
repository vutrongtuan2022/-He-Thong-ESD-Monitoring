import React, {useEffect, useState} from 'react';

import {IFormUpdate, PropsFormUpdateDevice} from './interfaces';
import styles from './FormUpdateDevice.module.scss';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import deviceServices from '~/services/deviceServices';
import {httpRequest} from '~/services';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import categoryServices from '~/services/categoryServices';
import {useRouter} from 'next/router';

function FormUpdateDevice({dataUpdate, onClose}: PropsFormUpdateDevice) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _pin, _onlineState, _ngState, _status} = router.query;

	const [form, setForm] = useState<IFormUpdate>({
		uuid: '',
		macNumber: '',
		name: '',
		teamUuid: '',
	});

	// SET FORM UPDATE
	useEffect(() => {
		if (dataUpdate) {
			setForm({
				uuid: dataUpdate.uuid,
				macNumber: dataUpdate.macNumber,
				name: dataUpdate.name,
				teamUuid: dataUpdate.teamUuid || '',
			});
			console.log(dataUpdate);
		}
	}, [dataUpdate]);

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

	// API
	const upsertDevice = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa bộ phát thành công!',
				http: deviceServices.upsertDevice({
					uuid: form.uuid,
					name: form.name,
					macNumber: form.macNumber,
					teamUuid: form.teamUuid,
					status: STATUS_GENERAL.SU_DUNG,
					gatewayUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([
					QUERY_KEY.danh_sach_bo_phat,
					_page,
					_pageSize,
					_keyword,
					_pin,
					_onlineState,
					_ngState,
					_status,
				]);
				onClose();
				setForm({
					uuid: '',
					macNumber: '',
					name: '',
					teamUuid: '',
				});
			}
		},
	});

	const handleSubmit = async () => {
		if (!form.uuid) {
			return toastWarn({msg: 'Không tìm thấy thiết bị!'});
		}
		if (!form.macNumber) {
			return toastWarn({msg: 'Vui lòng nhập số MAC thiết bị!'});
		}
		if (!form.name) {
			return toastWarn({msg: 'Vui lòng nhập tên thiết bị!'});
		}

		return upsertDevice.mutate();
	};

	return (
		<div className={styles.container}>
			<h4>Chỉnh sửa bộ phát</h4>
			<Loading loading={upsertDevice.isLoading} />
			<Form form={form} setForm={setForm}>
				<Input
					label={
						<span>
							Số MAC thiết bị <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder='Nhập số mac cho thiết bị'
					name='macNumber'
					value={form.macNumber}
					type='text'
				/>
				<Input
					label={
						<span>
							Tên thiết bị <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder='Nhập tên mới cho thiết bị'
					name='name'
					value={form.name}
					type='text'
				/>
				<div className='mt'>
					<Select
						isSearch
						name='teamUuid'
						value={form.teamUuid || null}
						placeholder='Lựa chọn'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								teamUuid: e.target.value,
							}))
						}
						label={<span>Thuộc team</span>}
					>
						{listTeams?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
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

export default FormUpdateDevice;
