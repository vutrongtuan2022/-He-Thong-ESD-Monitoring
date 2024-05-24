import React, {useEffect, useState} from 'react';
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
import {GENDER, QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import categoryServices from '~/services/categoryServices';
import userServices from '~/services/userServices';
import {toastWarn} from '~/common/funcs/toast';
import moment from 'moment';

const MainUpdateUser = ({dataUpdate}: PropsMainUpdateUser) => {
	const router = useRouter();

	const {_id} = router.query;
	const [date, setDate] = useState<string>('');
	const [form, setForm] = useState<IFormUpdate>({
		uuid: '',
		userName: '',
		fullname: '',
		teamUuid: '',
		gender: GENDER.NAM,
		email: '',
		phone: '',
		address: '',
		birthday: '',
		avatar: '',
		role: '',
		status: STATUS_GENERAL.SU_DUNG,
		code: '',
	});

	const {data, isSuccess} = useQuery([QUERY_KEY.chi_tiet_nhan_vien, _id], {
		queryFn: () =>
			httpRequest({
				http: userServices.userDetail({
					uuid: _id as string,
				}),
			}),
		enabled: !!_id,
	});

	useEffect(() => {
		if (data) {
			setForm({
				uuid: data.uuid,
				userName: data.userName || '',
				fullname: data.fullname || '',
				teamUuid: data.teamUuid || '',
				email: data.email || '',
				phone: data.phone || '',
				gender: data.gender,
				address: data.address || '',
				birthday: data.birthday || '',
				avatar: data.avatar || '',
				role: data.role || '',
				status: data.status,
				code: data.code || '',
			});
			setDate(data.birthday);
		}
	}, [data, isSuccess]);

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
				http: categoryServices.listRole({
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
				msgSuccess: 'Chỉnh sửa thành công!',
				http: userServices.upsertUser({
					uuid: form.uuid,
					fullname: form.fullname,
					userName: form.userName,
					email: form.email,
					address: form.address,
					avatar: '',
					birthday: form.birthday,
					phone: form.phone,
					gender: form.gender,
					role: form.role,
					code: form.code,
					status: form.status as STATUS_GENERAL,
					teamUuid: form.teamUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				router.push(PATH.NhanVien);
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
			return toastWarn({msg: 'Vui lòng nhập phone!'});
		}
		if (!form.teamUuid) {
			return toastWarn({msg: 'Vui lòng nhập thuộc team!'});
		}
		if (!form.birthday) {
			return toastWarn({msg: 'Vui lòng nhập ngày sinh!'});
		}
		if (!form.role) {
			return toastWarn({msg: 'Vui lòng nhập chức vụ!'});
		}

		return upsertUser.mutate();
	};

	return (
		<div>
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
						title: 'Sửa người nhân viên',
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>Chỉnh sửa nhân viên</h4>
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
								<Input name='address' value={form.address || ''} label={<span>Địa chỉ</span>} placeholder='Nhập địa chỉ' />
								<div className={clsx('col_2')}>
									<DatePicker
										icon={true}
										label={'Ngày sinh'}
										placeholder='Chọn ngày sinh'
										value={date}
										onSetValue={(newDate) => {
											const formattedDate = moment(newDate).format('YYYY-MM-DD');
											setDate(formattedDate);
											setForm((prevForm) => ({
												...prevForm,
												birthday: formattedDate,
											}));
										}}
										name='birthday'
										onClean={true}
									/>
									<div className={styles.gender}>
										<label className={styles.title}>Giới tính</label>
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

											{/* <div className={styles.item_radio}>
												<input
													id='other'
													className={styles.input_radio}
													type='radio'
													name='gender'
													value={GENDER.KHAC}
													checked={form.gender === GENDER.KHAC}
													onChange={(e) =>
														setForm((prev) => ({
															...prev,
															gender: GENDER.KHAC,
														}))
													}
												/>
												<label className={styles.input_label} htmlFor='other'>
													Khác
												</label>
											</div> */}
										</div>
									</div>
								</div>
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
												Số diện thoại <span style={{color: 'red'}}>*</span>
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
										name='role'
										value={form.role || ''}
										placeholder='Lựa chọn'
										onChange={(e) =>
											setForm((prev) => ({
												...prev,
												role: e.target.value,
											}))
										}
										label={
											<span>
												Chức vụ <span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										{listRoles?.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.name} />
										))}
									</Select>
								</div>
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
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default MainUpdateUser;
