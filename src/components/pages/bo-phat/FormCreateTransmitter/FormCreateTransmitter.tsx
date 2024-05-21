import React, {useState} from 'react';

import {IForm, PropsFormCreateTransmitter} from './interfaces';
import styles from './FormCreateTransmitter.module.scss';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {QUERY_KEY, STATUS_DEVICE} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import deviceServices from '~/services/deviceServices';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';

function FormCreateTransmitter({onClose}: PropsFormCreateTransmitter) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _pin, _onlineState, _ngState, _status} = router.query;

	const [form, setForm] = useState<IForm>({
		macNumber: '',
		name: '',
		gatewayUuid: '',
		teamUuid: '',
		status: STATUS_DEVICE.SU_DUNG,
	});

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

	const listGateways = useQuery([QUERY_KEY.dropdown_danh_sach_gateway], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listGateway({
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
				msgSuccess: 'Thêm mới bộ phát thành công!',
				http: deviceServices.upsertDevice({
					uuid: '',
					name: form.name,
					macNumber: form.macNumber,
					gatewayUuid: form.gatewayUuid,
					teamUuid: form.teamUuid,
					status: form.status,
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
					macNumber: '',
					name: '',
					gatewayUuid: '',
					teamUuid: '',
					status: STATUS_DEVICE.SU_DUNG,
				});
			}
		},
	});

	const handleSubmit = async () => {
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
			<h4>Thêm mới bộ phát</h4>
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
						name='gatewayUuid'
						value={form.gatewayUuid || null}
						placeholder='Lựa chọn gateway'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								gatewayUuid: e.target.value,
							}))
						}
						label={<span>Chọn gateway</span>}
					>
						{listGateways?.data?.items?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
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
						{listTeams?.data?.items?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
					<Select
						name='status'
						value={Number(form?.status)}
						placeholder='Lựa chọn trạng thái'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								status: e.target.value,
							}))
						}
						label={<span>Trạng thái</span>}
					>
						<Option title='Sử dụng' value={STATUS_DEVICE.SU_DUNG} />
						<Option title='Không sử dụng' value={STATUS_DEVICE.KHONG_SU_DUNG} />
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
							Xác nhận
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

export default FormCreateTransmitter;
