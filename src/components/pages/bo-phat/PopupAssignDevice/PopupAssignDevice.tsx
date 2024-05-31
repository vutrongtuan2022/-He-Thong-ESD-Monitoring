import React, {useState} from 'react';

import {PropsPopupAssignDevice} from './interfaces';
import styles from './PopupAssignDevice.module.scss';
import {IoClose} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import Select, {Option} from '~/components/common/Select';
import Form from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import deviceServices from '~/services/deviceServices';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

function PopupAssignDevice({onClose}: PropsPopupAssignDevice) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [form, setForm] = useState<{teamUuid: string; note: string}>({
		teamUuid: '',
		note: '',
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

	const assignTeamUsing = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Device.UsageRightsGrantedSuccessfully'),
				http: deviceServices.updateTeamUsing({
					uuid: _id as string,
					teamUuid: form.teamUuid,
					note: form.note,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_bo_phat, _id]);
			}
		},
	});

	const handleSubmit = async () => {
		assignTeamUsing.mutate();
	};

	return (
		<div className={styles.container}>
			<h4>{i18n.t('Device.AssignUsageRights')}</h4>
			<Loading loading={assignTeamUsing.isLoading} />
			<Form form={form} setForm={setForm}>
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
						label={
							<span>
								{i18n.t('Common.thuocteam')} <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listTeams?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>
				<div className='mt'>
					<TextArea name='note' value={form.note} label={i18n.t('Device.Options')} placeholder={i18n.t('Device.Nhapghichu')} />
				</div>
			</Form>
			<div className={styles.btn}>
				<div>
					<Button p_10_24 rounded_6 grey_outline onClick={onClose}>
					{i18n.t('Common.huybo')}
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
		</div>
	);
}

export default PopupAssignDevice;
