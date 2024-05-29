import React, {useEffect, useState} from 'react';

import {PropsUpdateAccount} from './interfaces';
import styles from './UpdateAccount.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import AvatarChange from '~/components/common/AvatarChange';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import {QUERY_KEY, STATUS_GENERAL, TYPE_UPLOAD} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import uploadServices from '~/services/uploadServices';

function UpdateAccount({dataUpdateAccount, onClose}: PropsUpdateAccount) {
	const queryClient = useQueryClient();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<{
		avatar: string;
		fullName: string;
		userName: string;
		roleUuid: string;
	}>({avatar: '', fullName: '', userName: '', roleUuid: ''});

	const listRoles = useQuery([QUERY_KEY.dropdown_danh_sach_role], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listRole({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		setForm({
			avatar: dataUpdateAccount?.image || '',
			fullName: dataUpdateAccount?.fullName || '',
			userName: dataUpdateAccount?.email || '',
			roleUuid: dataUpdateAccount?.roleUuid || '',
		});
	}, [dataUpdateAccount]);

	const funcCreateAccount = useMutation({
		mutationFn: (body: {avatar: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cấp tài khoản thành công!',
				http: accountServices.updateAccount({
					uuid: dataUpdateAccount?.uuid!,
					roleUuid: form.roleUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_nhan_vien]);
			}
		},
	});

	const handleSubmit = async () => {
		if (!file && !form.avatar) {
			return toastWarn({msg: 'Vui lòng chọn ảnh!'});
		}
		if (!dataUpdateAccount?.uuid) {
			return toastWarn({msg: 'Không tìm thấy tài khoản!'});
		}
		if (!form?.roleUuid) {
			return toastWarn({msg: 'Vui lòng chọn vai trò cho tài khoản!'});
		}

		if (!!file) {
			const resImage = await httpRequest({
				setLoading,
				http: uploadServices.upload({
					FileData: file,
					Type: TYPE_UPLOAD.AVATAR,
				}),
			});

			return funcCreateAccount.mutate({
				avatar: resImage,
			});
		} else {
			return funcCreateAccount.mutate({
				avatar: form.avatar,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcCreateAccount.isLoading} />
			<h4>Chỉnh sửa tài khoản</h4>
			<p className={styles.p}>Điền đẩy đủ các thông tin cần thiết</p>
			<Form form={form} setForm={setForm}>
				<div className={'mb'}>
					{/* <AvatarChange path={form?.avatar} name='avatar' onSetFile={(file: any) => setFile(file)} /> */}
				</div>
				<Input
					readOnly
					type='text'
					placeholder='Nhập tên nhân viên'
					name='fullName'
					value={form.fullName}
					label={
						<span>
							Tên nhân viên <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<Input
					readOnly
					type='text'
					placeholder='Nhập tên tài khoản'
					name='userName'
					value={form.userName}
					label={
						<span>
							Tên tài khoản <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={'mt'}>
					<Select
						isSearch
						name='roleUuid'
						value={form.roleUuid || null}
						placeholder='Lựa chọn'
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								roleUuid: e.target.value,
							}))
						}
						label={
							<span>
								Vai trò <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listRoles?.data?.map((v: any) => (
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

export default UpdateAccount;
