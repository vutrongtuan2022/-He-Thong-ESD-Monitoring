import React, {Fragment, useState} from 'react';
import {IFormUpdate, PropsMainUpdateUser} from './interfaces';
import styles from './MainUpdateUser.module.scss';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import DatePicker from '~/components/common/DatePicker';
import {GENDER, QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import userServices from '~/services/userServices';
import {toastWarn} from '~/common/funcs/toast';
import moment from 'moment';
import Loading from '~/components/common/Loading';
import {isEmail, isPhoneNumber} from '~/common/funcs/validate';
import i18n from '~/locale/i18n';

const MainUpdateUser = ({}: PropsMainUpdateUser) => {
	const router = useRouter();
	const {_id} = router.query;

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

	const [form, setForm] = useState<IFormUpdate>(initForm);

	const detailUser = useQuery([QUERY_KEY.chi_tiet_nhan_vien, _id], {
		queryFn: () =>
			httpRequest({
				http: userServices.userDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				fullname: data?.fullname || '',
				teamUuid: data?.teamUuid || '',
				gender: data?.gender == 1 ? GENDER.NU : GENDER.NAM,
				email: data?.email || '',
				phone: data?.phone || '',
				address: data?.address || '',
				birthday: data?.birthday || '',
				code: data?.code || '',
				regencyUuid: data?.regencyUuid || '',
			});
		},
		enabled: !!_id,
	});

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
				msgSuccess: i18n.t('User.chinhsuanhanvienthanhcong'),
				http: userServices.upsertUser({
					uuid: _id as string,
					fullname: form.fullname,
					email: form.email,
					address: form.address,
					birthday: moment(form.birthday).format('YYYY-MM-DD'),
					phone: form.phone,
					gender: form.gender,
					regencyUuid: form.regencyUuid,
					code: form.code,
					teamUuid: form.teamUuid,
					userName: detailUser?.data?.userName,
					avatar: detailUser?.data?.avatar,
					status: detailUser?.data?.status,
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

		if (!_id) {
			return toastWarn({msg: i18n.t('User.khongtimthaynhanviennao')});
		}
		if (!form.code) {
			return toastWarn({msg: i18n.t('User.vuilongnhapmanhanvien')});
		}
		if (!form.fullname) {
			return toastWarn({msg: i18n.t('User.vuilongnhaphovaten')});
		}
		if (!form.email) {
			return toastWarn({msg: i18n.t('User.vuilongnhapemail')});
		}
		if (!form.phone) {
			return toastWarn({msg: i18n.t('User.vuilongnhapsodienthoai')});
		}
		if (!form.regencyUuid) {
			return toastWarn({msg: i18n.t('User.vuilongchonchucvu')});
		}
		if (!form.birthday) {
			return toastWarn({msg: i18n.t('User.vuilongchonngaysinh')});
		}
		if (!isPhoneNumber(form.phone)) {
			return toastWarn({msg: i18n.t('User.sodienthoaikhongdungdinhdang')});
		}
		if (!isEmail(form.email)) {
			return toastWarn({msg: i18n.t('User.emailkhongdungdinhdang')});
		}
		if (selectedDate.isAfter(today)) {
			return toastWarn({msg: i18n.t('User.ngaysinhkhonghople')});
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
						title: i18n.t('User.quanlynhanvien'),
						path: PATH.NhanVien,
					},
					{
						title: i18n.t('User.chinhsuanhanvien'),
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>{i18n.t('User.chinhsuanhanvien')}</h4>
							<p>{i18n.t('User.diendayduthongtinnhanvien')}</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.NhanVien} p_10_24 rounded_2 grey_outline>
								{i18n.t('User.huybo')}
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								{i18n.t('User.Luulai')}
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
												{i18n.t('User.manhanvien')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.nhapmanhanvien')}
									/>
								</div>
								<Input
									name='fullname'
									value={form.fullname || ''}
									label={
										<span>
											{i18n.t('User.hovaten')} <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('User.nhaphovaten')}
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
									placeholder={i18n.t('User.nhapemail')}
								/>
								<div>
									<Input
										name='phone'
										value={form.phone || ''}
										label={
											<span>
												{i18n.t('User.sodienthoai')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.nhapsodienthoai')}
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<div>
									<Select
										isSearch
										name='regencyUuid'
										value={form.regencyUuid || null}
										placeholder={i18n.t('User.luachon')}
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												regencyUuid: e.target.value,
											}))
										}
										label={
											<span>
												{i18n.t('User.chucvu')} <span style={{color: 'red'}}>*</span>
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
												{i18n.t('User.ngaysinh')} <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder={i18n.t('User.chonngaysinh')}
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
											{i18n.t('User.gioitinh')} <span style={{color: 'red'}}>*</span>
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
													{i18n.t('User.nam')}
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
													{i18n.t('User.nu')}
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
									placeholder={i18n.t('User.luachon')}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											teamUuid: e.target.value,
										}))
									}
									label={<span>{i18n.t('User.thuocteam')}</span>}
								>
									{listTeams?.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
								<Input
									type='text'
									name='address'
									value={form.address || ''}
									label={<span>{i18n.t('User.diachi')}</span>}
									placeholder={i18n.t('User.nhapdiachi')}
								/>
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</Fragment>
	);
};

export default MainUpdateUser;
