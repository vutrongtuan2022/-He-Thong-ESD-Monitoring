import React, {useState} from 'react';

import {PropsMainCreateArea} from './interfaces';
import styles from './MainCreateArea.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import Select, {Option} from '~/components/common/Select';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import categoryServices from '~/services/categoryServices';
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function MainCreateArea({onClose}: PropsMainCreateArea) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		code: string;
		name: string;
		uuidArea: string;
		note: string;
	}>({name: '', code: '', uuidArea: '', note: ''});

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

	const upsertArea = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Area.SuccessfullyAddedNewArea'),
				http: areaServices.upsertArea({
					uuid: '',
					code: form.code,
					name: form.name,
					address: null,
					notes: form.note,
					rootUuid: null,
					parentUuid: form.uuidArea || null,
					status: STATUS_GENERAL.SU_DUNG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({name: '', code: '', uuidArea: '', note: ''});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.thong_so_chung_khu_vuc]);
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_tree_khu_vuc]);
			}
		},
	});

	const handleSubmit = () => {
		if (!form.code) {
			return toastWarn({msg: i18n.t('Area.PleaseEnterCodeOnly')});
		}
		if (!form.name) {
			return toastWarn({msg: i18n.t('Area.PleaseEnterAName')});
		}

		return upsertArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={upsertArea.isLoading} />
			<h4>{i18n.t('Area.AddRegion')} </h4>
			<p className={styles.p}>{i18n.t('Area.FillInAllNecessaryInformation')}</p>

			<Form form={form} setForm={setForm}>
				<Input
					type='text'
					placeholder={i18n.t('Area.EnterAreaCode')}
					value={form.code}
					isRequired
					min={1}
					max={20}
					name='code'
					label={
						<span>
							{i18n.t('Area.AreaCode')} <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<Input
					type='text'
					placeholder={i18n.t('Area.EnterAreaName')}
					value={form.name}
					name='name'
					isRequired
					min={1}
					max={50}
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

				<div className='mt'>
					<TextArea
						name='note'
						min={0}
						max={255}
						value={form.note}
						placeholder={i18n.t('Common.EnterNote')}
						label={<span>{i18n.t('Common.Note')} </span>}
					/>
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							{i18n.t('Common.Cancel')}
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div>
								<Button disable={!isDone} p_10_24 rounded_2 primary onClick={handleSubmit}>
									{i18n.t('Common.Confirm')}
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

export default MainCreateArea;
