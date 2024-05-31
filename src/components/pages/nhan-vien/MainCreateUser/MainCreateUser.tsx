import React, {Fragment, useState} from 'react';
import {IForm, PropsMainCreateUser} from './interfaces';
import styles from './MainCreateUser.module.scss';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import DatePicker from '~/components/common/DatePicker';
import {GENDER, QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import {useRouter} from 'next/router';
import categoryServices from '~/services/categoryServices';
import {toastWarn} from '~/common/funcs/toast';
import moment from 'moment';
import {isEmail, isPhoneNumber} from '~/common/funcs/validate';
import Loading from '~/components/common/Loading';
import i18n from '~/locale/i18n';

const MainCreateUser = ({}: PropsMainCreateUser) => {
	const router = useRouter();

	const initForm = {
		fullname: '',
		teamUuid: '',
		gender: GENDER.NAM,
		email: '',
		phone: '',
		address: '',
		birthday: '',
		code: '',
		regencyUuid: '',
	};

	const [form, setForm] = useState<IForm>(initForm);

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

	const upsertUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('User.Addnewusersuccessfully'),
				http: userServices.upsertUser({
					uuid: '',
					userName: '',
					avatar: '',
					fullname: form.fullname,
					email: form.email,
					address: form.address,
					birthday: moment(form.birthday).format('YYYY-MM-DD'),
					phone: form.phone,
					gender: form.gender,
					regencyUuid: form.regencyUuid,
					code: form.code,
					teamUuid: form.teamUuid,
					status: STATUS_GENERAL.SU_DUNG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm(initForm);
				router.replace(PATH.NhanVien, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
	});

	const handleSubmit = async () => {
		const today = moment().startOf('day');
		const selectedDate = moment(form.birthday).startOf('day');

		if (!form.code) {
			return toastWarn({msg: i18n.t('User.Pleaseenteruserid')});
		}
		if (!form.code) {
			return toastWarn({msg: i18n.t('User.Pleaseenteruserid')});
		}
		if (!form.fullname) {
			return toastWarn({msg: i18n.t('User.Vuilongnhaphovaten')});
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

		return upsertUser.mutate();
	};

	return (
		<Fragment>
			<Loading loading={upsertUser.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						title: i18n.t('Common.home'),
						path: PATH.Home,
					},
					{
						title: i18n.t('User.Usermanager'),
						path: PATH.NhanVien,
					},
					{
						title: i18n.t('User.Adduser'),
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>{i18n.t('User.Adduser')}</h4>
							<p>{i18n.t('User.Fillinuserinformationcompletely')}</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.NhanVien} p_10_24 rounded_2 grey_outline>
								{i18n.t('Common.Cancel')}
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								{i18n.t('Common.Save')}
							</Button>
						</div>
					</div>
					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<div className={clsx('col_2')}>
								<div>
									<Input
										name='code'
										value={form.code || ''}
										label={
											<span>
												{i18n.t('User.IDuser')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.Enteriduser')}
									/>
								</div>
								<Input
									name='fullname'
									value={form.fullname || ''}
									label={
										<span>
											{i18n.t('User.Fullname')} <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('User.Enterfullname')}
								/>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<Input
									name='email'
									value={form.email || ''}
									label={
										<span>
											Email <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('User.Enteremail')}
								/>
								<div>
									<Input
										name='phone'
										value={form.phone || ''}
										label={
											<span>
												{i18n.t('User.Phonenumber')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.Enterphonenumber')}
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<div>
									<Select
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
												{i18n.t('User.Regency')} <span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										{listRegencys?.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
										))}
									</Select>
								</div>
								<div className={clsx('col_2')}>
									<DatePicker
										icon={true}
										label={
											<span>
												{i18n.t('User.Dateofbirth')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.Selectdateofbirth')}
										value={form.birthday}
										onSetValue={(date) =>
											setForm((prevForm) => ({
												...prevForm,
												birthday: date,
											}))
										}
										name='birthday'
										onClean={true}
									/>
									<div className={styles.gender}>
										<label className={styles.title}>
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
							</div>

							<div className={clsx('mt', 'col_2')}>
								<Select
									isSearch
									name='teamUuid'
									value={form.teamUuid || null}
									placeholder={i18n.t('Common.Select')}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											teamUuid: e.target.value,
										}))
									}
									label={<span>{i18n.t('User.Belongtotheteam')}</span>}
								>
									{listTeams?.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
								<Input
									type='text'
									name='address'
									value={form.address || ''}
									label={<span>{i18n.t('Common.Address')}</span>}
									placeholder={i18n.t('Common.Enteraddress')}
								/>
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</Fragment>
	);
};

export default MainCreateUser;
