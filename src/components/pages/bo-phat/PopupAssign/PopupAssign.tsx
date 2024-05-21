import React, {useState} from 'react';

import {PropsPopupAssign} from './interfaces';
import styles from './PopupAssign.module.scss';
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

function PopupAssign({onClose}: PropsPopupAssign) {
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
				msgSuccess: 'Mở quyền sử dụng thành công!',
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
			<h4>Gắn quyền sử dụng</h4>
			<Loading loading={assignTeamUsing.isLoading} />
			<Form form={form} setForm={setForm}>
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
						label={
							<span>
								Thuộc team <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listTeams?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>
				<div className='mt'>
					<TextArea name='note' value={form.note} label='Ghi chú' placeholder='Nhập ghi chú' />
				</div>
			</Form>
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
		</div>
	);
}

export default PopupAssign;
