import React, {useState} from 'react';

import {PropsMainEditProfile} from './interfaces';
import styles from './MainEditProfile.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {BsThreeDots} from 'react-icons/bs';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {GENDER, QUERY_KEY, TYPE_UPLOAD} from '~/constants/config/enum';
import AvatarChange from '~/components/common/AvatarChange';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {useRouter} from 'next/router';
import categoryServices from '~/services/categoryServices';
import i18n from '~/locale/i18n';
import accountServices from '~/services/accountServices';
import {RootState, store} from '~/redux/store';
import {setInfoUser} from '~/redux/reducer/user';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {toastWarn} from '~/common/funcs/toast';
import {isEmail, isPhoneNumber} from '~/common/funcs/validate';
import uploadServices from '~/services/uploadServices';
import Loading from '~/components/common/Loading';
import DatePicker from '~/components/common/DatePicker';

function MainEditProfile({}: PropsMainEditProfile) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;
	const {infoUser} = useSelector((state: RootState) => state.user);

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [form, setForm] = useState<{
		image: string;
		fullName: string;
		email: string;
		phone: string;
		birthday: Date | string;
		gender: number;
		regencyUuid: string;
		roleUuid: string;
		address: string;
	}>({
		image: '',
		fullName: '',
		phone: '',
		email: '',
		birthday: '',
		gender: 0,
		roleUuid: '',
		regencyUuid: '',
		address: '',
	});

	useQuery([QUERY_KEY.chi_tiet_nguoi_dung, _id], {
		queryFn: () =>
			httpRequest({
				http: accountServices.accountDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				image: data.image || '',
				fullName: data.fullName || '',
				phone: data.phone || '',
				email: data.email || '',
				birthday: data.birthday ? new Date(data.birthday) : '',
				gender: data.gender || 0,
				roleUuid: data.roleUuid || '',
				regencyUuid: data.regencyUuid || '',
				address: data.address || '',
			});
			store.dispatch(
				setInfoUser({
					...infoUser,
					avatar: data.image,
				})
			);
		},
		enabled: !!_id,
	});

	const listRegencys = useQuery([QUERY_KEY.dropdown_danh_sach_chuc_vu], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listRegency({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

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

	const funcUpdateAccount = useMutation({
		mutationFn: (body: {avatar: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Profile.UpdateSuccessful'),
				http: accountServices.updateAccoutLogin({
					uuid: _id as string,
					email: form?.email,
					phone: form.phone,
					fullName: form.fullName,
					birthday: moment(form.birthday).format('YYYY-MM-DD'),
					address: form.address,
					imagesUuid: body.avatar,
					regencyUuid: form.regencyUuid,
					roleUuid: form?.roleUuid,
					gender: form.gender,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nguoi_dung, _id]);
				store.dispatch(
					setInfoUser({
						...infoUser,
						fullname: form.fullName,
					})
				);
			}
		},
	});

	const handleSubmit = async () => {
		const today = moment().startOf('day');
		const selectedDate = moment(form.birthday).startOf('day');

		if (!_id) {
			return toastWarn({msg: i18n.t('User.Nousernotfound')});
		}
		if (!form.fullName) {
			return toastWarn({msg: i18n.t('User.Pleaseenteryourfirstandlastname')});
		}
		if (!form.email) {
			return toastWarn({msg: i18n.t('User.Pleaseenteremail')});
		}
		if (!form.phone) {
			return toastWarn({msg: i18n.t('User.Pleaseenterthephonenumber')});
		}
		if (!form.regencyUuid) {
			return toastWarn({msg: i18n.t('User.Pleaseselectaregency')});
		}
		if (!form?.roleUuid) {
			return toastWarn({msg: i18n.t('Account.PleaseChooseRoleAccount')});
		}
		if (!form.birthday) {
			return toastWarn({msg: i18n.t('User.Pleaseselectdateofbirth')});
		}
		if (!isPhoneNumber(form.phone)) {
			return toastWarn({msg: i18n.t('User.Thephonenumberisnotinthecorrectformat')});
		}
		if (!isEmail(form.email)) {
			return toastWarn({msg: i18n.t('User.Emailinvalidate')});
		}
		if (selectedDate.isAfter(today)) {
			return toastWarn({msg: i18n.t('User.Invaliddateofbirth')});
		}
		if (!file && !form.image) {
			return toastWarn({msg: i18n.t('Account.PleaseChooseImage')});
		}

		if (!!file) {
			const resImage = await httpRequest({
				setLoading,
				http: uploadServices.upload({
					FileData: file,
					Type: TYPE_UPLOAD.AVATAR,
				}),
			});

			if (!resImage) {
				return toastWarn({msg: i18n.t('Common.UploadError')});
			}

			return funcUpdateAccount.mutate({
				avatar: resImage,
			});
		} else {
			return funcUpdateAccount.mutate({
				avatar: form.image,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={loading || funcUpdateAccount.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: '',
						title:i18n.t('Profile.EditAccount') ,
					},
				]}
				action={
					<div className={styles.main_action}>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>{i18n.t('Profile.PasswordChangeSuccessful')}Chỉnh sửa người dùng</h4>
							<p>{i18n.t('Profile.PasswordChangeSuccessful')}Điền đầy đủ các thông tin người dùng</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.Profile} p_10_24 rounded_2 grey_outline>
								{i18n.t('Profile.PasswordChangeSuccessful')}Hủy bỏ
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								{i18n.t('Profile.PasswordChangeSuccessful')}Cập nhật
							</Button>
						</div>
					</div>

					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<div className={'mb'}>
								<AvatarChange path={form?.image} name='avatar' onSetFile={(file: any) => setFile(file)} />
							</div>
							<Input
								name='fullName'
								value={form.fullName || ''}
								label={
									<span>
									{i18n.t('Usr.Fullname')}<span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder={i18n.t('Profile.EnterUsername')}
							/>
							<div className={clsx('mt', 'col_2')}>
								<Input
									readOnly
									name='email'
									value={form.email || ''}
									label={
										<span>
											Email <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('Profile.Enteremail')}
								/>
								<div>
									<Input
										isNumber
										type='number'
										name='phone'
										value={form.phone || ''}
										label={
											<span>
												{i18n.t('Common.PhoneNumber')}<span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('Profile.Enterphonenumber')}
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<DatePicker
									icon={true}
									label={
										<span>
											{i18n.t('Common.Dateofbirth')} <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('Profile.Selectdateofbirth')}
									value={form.birthday}
									onSetValue={(date) =>
										setForm((prev: any) => ({
											...prev,
											birthday: date,
										}))
									}
									name='birthday'
									onClean={true}
								/>
								<div className={styles.gennder}>
									<label>
										{i18n.t('Common.Gender')} <span style={{color: 'red'}}>*</span>
									</label>
									<div className={styles.group_radio}>
										<div className={styles.item_radio}>
											<input
												id='male'
												className={styles.input_radio}
												type='radio'
												name='gender'
												value={GENDER.NAM}
												checked={form.gender === GENDER.NAM}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														gender: GENDER.NAM,
													}))
												}
											/>
											<label className={styles.input_label} htmlFor='male'>
												{i18n.t('Common.Male')}
											</label>
										</div>

										<div className={styles.item_radio}>
											<input
												id='female'
												className={styles.input_radio}
												type='radio'
												name='gender'
												value={GENDER.NU}
												checked={form.gender === GENDER.NU}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														gender: GENDER.NU,
													}))
												}
											/>
											<label className={styles.input_label} htmlFor='female'>
												{i18n.t('Common.Female')}
											</label>
										</div>
									</div>
								</div>
							</div>

							<div className={clsx('col_2', 'mt')}>
								<Select
									readOnly
									isSearch
									name='regencyUuid'
									value={form.regencyUuid || null}
									placeholder={i18n.t('Common.Select')}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											regencyUuid: e.target.value,
										}))
									}
									label={
										<span>
											{i18n.t('Common.Regency')} <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listRegencys?.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
								<div>
									<Select
										readOnly
										isSearch
										name='roleUuid'
										value={form.roleUuid || null}
										placeholder={i18n.t('Common.Select')}
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												roleUuid: e.target.value,
											}))
										}
										label={
											<span>
												{i18n.t('Common.Role')} <span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										{listRoles?.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
										))}
									</Select>
								</div>
							</div>

							<div className={clsx('mt')}>
								<Input name='address' value={form.address || ''} label={<span>{i18n.t('Profile.PasswordChangeSuccessful')}Địa chỉ</span>} placeholder={i18n.t('Profile.PasswordChangeSuccessful')}'Nhập địa chỉ' />
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainEditProfile;
