import React, {useState} from 'react';

import {PropsMainUpdateArea} from './interfaces';
import styles from './MainUpdateArea.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import {useRouter} from 'next/router';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import categoryServices from '~/services/categoryServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function MainUpdateArea({onClose}: PropsMainUpdateArea) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_uuid} = router.query;

	const [form, setForm] = useState<{
		code: string;
		name: string;
		uuidArea: string;
		address: string;
		note: string;
	}>({name: '', code: '', uuidArea: '', address: '', note: ''});

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

	// GET DETAIL
	const detailArea = useQuery([QUERY_KEY.chi_tiet_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getDetail({
					uuid: _uuid as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				name: data?.name || '',
				code: data?.code || '',
				uuidArea: data?.parentUuid || '',
				address: data?.address || '',
				note: data?.notes || '',
			});
		},
		enabled: !!_uuid,
	});

	const upsertArea = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess:i18n.t('Area.AreaEditingSuccessful'),
				http: areaServices.upsertArea({
					uuid: _uuid as string,
					code: form.code,
					name: form.name,
					address: form.address,
					notes: form.note,
					parentUuid: form.uuidArea || null,
					rootUuid: detailArea?.data?.rootUuid || null,
					status: detailArea?.data?.status,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({name: '', code: '', uuidArea: '', address: '', note: ''});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_tree_khu_vuc]);
			}
		},
	});

	const handleSubmit = () => {
		if (!form.code) {
			return toastWarn({msg:i18n.t('Area.PleaseEnterCodeOnly')});
		}
		if (!form.name) {
			return toastWarn({msg:i18n.t('Area.PleaseEnterAName') });
		}
		if (!form.address) {
			return toastWarn({msg: i18n.t('Area.PleaseEnterLocation')});
		}

		return upsertArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={upsertArea.isLoading} />
			<h4>{i18n.t('Area.AreaEditing')}</h4>
			<p className={styles.p}>{i18n.t('Area.FillInAllNecessaryInformation')}</p>

			<Form form={form} setForm={setForm}>
				<Input
					type='text'
					placeholder={i18n.t('Area.EnterCode')}
					value={form.code}
					name='code'
					label={
						<span>
							CODE <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<Input
					type='text'
					placeholder={i18n.t('Area.EnterAreaName')}
					value={form.name}
					name='name'
					label={
						<span>
							{i18n.t('Area.AreaName')} <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<div className='mt'>
					<Select
						isSearch
						name='uuidArea'
						value={form.uuidArea || null}
						placeholder={i18n.t('Area.SelectManagementArea')}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								uuidArea: e.target.value,
							}))
						}
						label={<span>{i18n.t('Area.BelongsToRegion')}</span>}
					>
						{listAreas?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>
				<div className={'mt'}>
					<Input
						type='text'
						placeholder={i18n.t('Area.EnterAddress')}
						value={form.address}
						name='address'
						label={
							<span>
								{i18n.t('Area.DetailedAddress')} <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>

				<div className='mt'>
					<TextArea name='note' value={form.note} placeholder={i18n.t('Common.EnterNote')} label={<span>{i18n.t('Common.Note')} </span>} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
						{i18n.t('Common.Cancel')}
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
						{i18n.t('Common.Confirm')}
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

export default MainUpdateArea;
