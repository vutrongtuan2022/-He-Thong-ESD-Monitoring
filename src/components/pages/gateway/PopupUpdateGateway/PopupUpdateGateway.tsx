import React, {useEffect, useState} from 'react';
import {PropsPopupUpdateGateway} from './interfaces';
import styles from './PopupUpdateGateway.module.scss';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';
import Select, {Option} from '~/components/common/Select';
import categoryServices from '~/services/categoryServices';

function PopupUpdateGateway({dataUpdate, onClose}: PropsPopupUpdateGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid} = router.query;

	const [form, setForm] = useState<{
		uuid: string;
		code: string;
		name: string;
		factoryAreaUuid: string;
		description: string;
	}>({uuid: '', code: '', name: '', factoryAreaUuid: '', description: ''});

	const listAreas = useQuery([QUERY_KEY.dropdown_danh_sach_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listArea({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (dataUpdate) {
			setForm({
				uuid: dataUpdate.uuid || '',
				code: dataUpdate.code || '',
				name: dataUpdate.name || '',
				factoryAreaUuid: dataUpdate.factoryAreaUuid || '',
				description: dataUpdate.notes || '',
			});
		}
	}, [dataUpdate]);

	const upsertGateway = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Gateway.EditedGatewaysuccessfully'),
				http: gatewayServices.upsertGateway({
					uuid: form.uuid,
					code: form.code,
					name: form.name,
					notes: form.description,
					factoryAreaUuid: form?.factoryAreaUuid,
					status: dataUpdate?.status!,
					state: dataUpdate?.state!,
					connection: dataUpdate?.connection,
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
					factoryAreaUuid: '',
					description: '',
				});
			}
		},
	});

	const handleSubmit = async () => {
		if (!form.code) {
			return toastWarn({msg: i18n.t('Gateway.PleaseEnterTheGatewayID')});
		}
		if (!form.name) {
			return toastWarn({msg: i18n.t('Gateway.PleaseEnterTheGatewayName')});
		}
		if (!form?.factoryAreaUuid) {
			return toastWarn({msg: i18n.t('Gateway.ChooseManagementArea')});
		}
		if (form?.description?.length > 255) {
			return toastWarn({msg: i18n.t('Common.MaxLengthNote')});
		}

		return upsertGateway.mutate();
	};

	return (
		<div className={styles.container}>
			<h4>{i18n.t('Gateway.EditGateway')}</h4>
			<Loading loading={upsertGateway.isLoading} />
			<Form form={form} setForm={setForm}>
				<Input
					readOnly
					type='text'
					placeholder={i18n.t('Gateway.EnterGatewayID')}
					name='code'
					isRequired
					min={5}
					max={50}
					label={
						<span>
							{i18n.t('Gateway.GatewayID')} <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<Input
					type='text'
					placeholder={i18n.t('Gateway.EnterGatewayName')}
					name='name'
					isRequired
					min={2}
					max={50}
					label={
						<span>
							{i18n.t('Gateway.NameGateway')} <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<div className='mt'>
					<Select
						isSearch
						name='factoryAreaUuid'
						value={form.factoryAreaUuid || null}
						placeholder={i18n.t('Area.SelectManagementArea')}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								factoryAreaUuid: e.target.value,
							}))
						}
						label={
							<span>
								{i18n.t('Area.BelongsToRegion')} <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listAreas?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>
				<div className={clsx('mt')}>
					<TextArea
						placeholder={i18n.t('Common.EnterNote')}
						name='description'
						label={<span>{i18n.t('Common.Note')}</span>}
						blur
					/>
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_6 grey_outline onClick={onClose}>
							{i18n.t('Common.Cancel')}
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div>
								<Button disable={!isDone} p_10_24 rounded_6 primary onClick={handleSubmit}>
									{i18n.t('Common.Update')}
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default PopupUpdateGateway;
