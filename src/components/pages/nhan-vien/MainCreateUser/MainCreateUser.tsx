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

	const listRoles = useQuery([QUERY_KEY.dropdown_danh_sach_chuc_vu], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listPosition({
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
				msgSuccess: 'Thêm mới nhân viên thành công!',
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
		if (!form.code) {
			return toastWarn({msg: 'Vui lòng nhập mã nhân viên!'});
		}
		if (!form.fullname) {
			return toastWarn({msg: 'Vui lòng nhập tên nhân viên!'});
		}
		if (!form.email) {
			return toastWarn({msg: 'Vui lòng nhập email!'});
		}
		if (!form.phone) {
			return toastWarn({msg: 'Vui lòng nhập số điện thoại!'});
		}
		if (!form.regencyUuid) {
			return toastWarn({msg: 'Vui lòng nhập chức vụ!'});
		}
		if (!form.birthday) {
			return toastWarn({msg: 'Vui lòng nhập ngày sinh!'});
		}
		if (!isPhoneNumber(form.phone)) {
			return toastWarn({msg: 'Số điện thoại không đúng định dạng!'});
		}
		if (!isEmail(form.email)) {
			return toastWarn({msg: 'Email không đúng định dạng!'});
		}

		return upsertUser.mutate();
	};

	return (
		<Fragment>
			<Loading loading={upsertUser.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý nhân viên',
						path: PATH.NhanVien,
					},
					{
						title: 'Thêm nhân viên',
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>Thêm nhân viên</h4>
							<p>Điền đầy đủ các thông tin nhân viên</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.NhanVien} p_10_24 rounded_2 grey_outline>
								Hủy bỏ
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								Lưu lại
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
												Mã nhân viên <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập mã nhân viên'
									/>
								</div>
								<Input
									name='fullname'
									value={form.fullname || ''}
									label={
										<span>
											Họ và tên <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập họ và tên'
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
									placeholder='Nhập email'
								/>
								<div>
									<Input
										name='phone'
										value={form.phone || ''}
										label={
											<span>
												Số điện thoại <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số điện thoại'
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<div>
									<Select
										isSearch
										name='regencyUuid'
										value={form.regencyUuid || null}
										placeholder='Lựa chọn'
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												regencyUuid: e.target.value,
											}))
										}
										label={
											<span>
												Chức vụ <span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										{listRoles?.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
										))}
									</Select>
								</div>
								<div className={clsx('col_2')}>
									<DatePicker
										icon={true}
										label={
											<span>
												Ngày sinh <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Chọn ngày sinh'
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
											Giới tính <span style={{color: 'red'}}>*</span>
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
													Nam
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
													Nữ
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
									placeholder='Lựa chọn'
									onChange={(e) =>
										setForm((prev) => ({
											...prev,
											teamUuid: e.target.value,
										}))
									}
									label={<span>Thuộc team</span>}
								>
									{listTeams?.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
								<Input
									type='text'
									name='address'
									value={form.address || ''}
									label={<span>Địa chỉ</span>}
									placeholder='Nhập địa chỉ'
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
