import React, {useState} from 'react';

import {IForm, PropsFormCreateDevice} from './interfaces';
import styles from './FormCreateDevice.module.scss';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import deviceServices from '~/services/deviceServices';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function FormCreateDevice({onClose}: PropsFormCreateDevice) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _pin, _onlineState, _ngState, _status} = router.query;

	const [form, setForm] = useState<IForm>({
		macNumber: '',
		name: '',
		teamUuid: '',
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

	// API
	const upsertDevice = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Device.ThemmoibophatThanhcong'),
				http: deviceServices.upsertDevice({
					uuid: '',
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
					macNumber: '',
					name: '',
					teamUuid: '',
				});
			}
		},
	});

	const handleSubmit = async () => {
		if (!form.macNumber) {
			return toastWarn({msg: i18n.t('Device.PleaseEnterDeviceMacAddress')});
		}
		if (!form.name) {
			return toastWarn({msg: i18n.t('Device.PleaseEnterDeviceName')});
		}

		return upsertDevice.mutate();
	};

	return (
		<div className={styles.container}>
			<h4>{i18n.t('Device.AddNewTransmitter')} </h4>
			<Loading loading={upsertDevice.isLoading} />
			<Form form={form} setForm={setForm}>
				<Input
					label={
						<span>
							{i18n.t('Device.DeviceMacAddress')} <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder={i18n.t('Device.EnterDeviceMacAddress')}
					name='macNumber'
					value={form.macNumber}
					type='text'
				/>
				<Input
					label={
						<span>
							{i18n.t('Device.DeviceName')} <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder={i18n.t('Device.EnterNewDeviceName')}
					name='name'
					value={form.name}
					type='text'
				/>
				<div className='mt'>
					<Select
						isSearch
						name='teamUuid'
						value={form.teamUuid || null}
						placeholder={i18n.t('Device.Options')}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								teamUuid: e.target.value,
							}))
						}
						label={<span>{i18n.t('Common.thuocteam')} </span>}
					>
						{listTeams?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_6 grey_outline onClick={onClose}>
							{i18n.t('Common.Huybo')}
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_6 primary onClick={handleSubmit}>
							{i18n.t('Common.xacnhan')}
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

export default FormCreateDevice;
