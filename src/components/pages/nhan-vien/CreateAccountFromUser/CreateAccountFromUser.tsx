import React, {useEffect, useState} from 'react';

import {PropsCreateAccountFromUser} from './interfaces';
import styles from './CreateAccountFromUser.module.scss';
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
import i18n from '~/locale/i18n';

function CreateAccountFromUser({dataCreateAccount, onClose}: PropsCreateAccountFromUser) {
	const queryClient = useQueryClient();

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<{
		avatar: string;
		userUuid: string;
		fullName: string;
		userName: string;
		roleUuid: string;
	}>({avatar: '', userUuid: '', fullName: '', userName: '', roleUuid: ''});

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
			avatar: dataCreateAccount?.avatar || '',
			userUuid: dataCreateAccount?.uuid || '',
			fullName: dataCreateAccount?.fullname || '',
			userName: dataCreateAccount?.email || '',
			roleUuid: '',
		});
	}, [dataCreateAccount]);

	const funcCreateAccount = useMutation({
		mutationFn: (body: {avatar: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('User.Captaikhoanthanhcong'),
				http: accountServices.registerAccount({
					userUuid: form?.userUuid,
					roleUuid: form?.roleUuid,
					status: STATUS_GENERAL.SU_DUNG,
					imagesUuid: body.avatar,
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
		if (!file) {
			return toastWarn({msg: i18n.t('User.Vuilongchonanh')});
		}
		if (!form?.userUuid) {
			return toastWarn({msg: i18n.t('User.Khongtimthaynhanviennao')});
		}
		if (!form?.roleUuid) {
			return toastWarn({msg: i18n.t('User.Vuilongchonvaitrotaikhoan')});
		}

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
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcCreateAccount.isLoading} />
			<h4>{i18n.t('User.Captaikhoan')} </h4>
			<p className={styles.p}>{i18n.t('User.Dienayduthongtincanthiet')}</p>
			<Form form={form} setForm={setForm}>
				<div className={'mb'}>
					<AvatarChange path={form?.avatar} name='avatar' onSetFile={(file: any) => setFile(file)} />
				</div>
				<Input
					readOnly
					type='text'
					placeholder={i18n.t('Common.Nhapmanhanvien')}
					name='fullName'
					value={form.fullName}
					label={
						<span>
							{i18n.t('Common.Tennhanvien')} <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<Input
					readOnly
					type='text'
					placeholder={i18n.t('Common.Nhaptentaikhoan')}
					name='userName'
					value={form.userName}
					label={
						<span>
							{i18n.t('Common.Tentaikhoan')} <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={'mt'}>
					<Select
						isSearch
						name='roleUuid'
						value={form.roleUuid || null}
						placeholder={i18n.t('Common.Luachon')}
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								roleUuid: e.target.value,
							}))
						}
						label={
							<span>
								{i18n.t('Common.Vaitro')} <span style={{color: 'red'}}>*</span>
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
							{i18n.t('Common.Huybo')}
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_6 primary onClick={handleSubmit}>
							{i18n.t('Common.Xacnhan')}
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

export default CreateAccountFromUser;
