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
				msgSuccess: 'Chỉnh sửa khu vực thành công!',
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
			return toastWarn({msg: 'Vui lòng nhập code!'});
		}
		if (!form.name) {
			return toastWarn({msg: 'Vui lòng nhập tên!'});
		}
		if (!form.address) {
			return toastWarn({msg: 'Vui lòng nhập địa chỉ!'});
		}

		return upsertArea.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={upsertArea.isLoading} />
			<h4>Chỉnh sửa khu vực</h4>
			<p className={styles.p}>Điền đẩy đủ các thông tin cần thiết</p>

			<Form form={form} setForm={setForm}>
				<Input
					type='text'
					placeholder='Nhập code'
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
					placeholder='Nhập tên khu vực'
					value={form.name}
					name='name'
					label={
						<span>
							Tên khu vực <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<div className='mt'>
					<Select
						isSearch
						name='uuidArea'
						value={form.uuidArea || null}
						placeholder='Lựa chọn khu vực quản lý'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								uuidArea: e.target.value,
							}))
						}
						label={<span>Thuộc khu vực</span>}
					>
						{listAreas?.data?.map((v: any) => (
							<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
						))}
					</Select>
				</div>
				<div className={'mt'}>
					<Input
						type='text'
						placeholder='Nhập địa chỉ'
						value={form.address}
						name='address'
						label={
							<span>
								Địa chỉ chi tiết <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
				</div>

				<div className='mt'>
					<TextArea name='note' value={form.note} placeholder='Nhập ghi chú' label={<span>Ghi chú </span>} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
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

export default MainUpdateArea;
