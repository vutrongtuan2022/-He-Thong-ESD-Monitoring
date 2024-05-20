import React, {useState} from 'react';
import {PropsMainPageCreateStaff} from './interfaces';
import styles from './MainPageCreateStaff.module.scss';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import DatePicker from '~/components/common/DatePicker';
import {GENDER, STATUS_GENERAL} from '~/constants/config/enum';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
const MainPageCreateStaff = ({}: PropsMainPageCreateStaff) => {
	const [date, setDate] = useState<string>('');
	const [form, setForm] = useState<any>({
		avatar: '',
		name: '',
		CCCD: '',
		email: '',
		phone: '',
		code: '',
		province: '',
		district: '',
		ward: '',
		address: '',
		note: '',
		personnel: '',
	});

	const upsertUser = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới nhân viên!',
				http: userServices.upsertUser({
					uuid: null,
					fullname: '',
					userName: '',
					email: '',
					address: '',
					avatar: '',
					birthday: '',
					phone: '',
					gender: GENDER.NAM,
					role: '',
					status: STATUS_GENERAL.MO,
					teamUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				console.log(data);
			}
		},
	});

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
							<Button p_10_24 rounded_2 primary>
								Lưu lại
							</Button>
						</div>
					</div>
					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<div className={clsx('col_2')}>
								<div>
									<Input
										name='name'
										value={form.name || ''}
										label={
											<span>
												Mã nhân viên <span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập mã nhân viên'
									/>
								</div>
								<Input
									name='name'
									value={form.name || ''}
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
									name='CCCD'
									value={form.CCCD || ''}
									label={
										<span>
											Số CCCD<span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập mã số CCCD'
								/>
								<div className={clsx('col_2')}>
									<DatePicker
										icon={true}
										label={'Ngày sinh'}
										placeholder='Chọn ngày sinh'
										value={date}
										onSetValue={setDate}
										name='dateOfBirth'
										onClean={true}
									/>
									<div className={styles.gennder}>
										<label className={styles.title}>Giới tính</label>
										<div className={styles.group_radio}>
											<div className={styles.item_radio}>
												<input
													id='male'
													className={styles.input_radio}
													type='radio'
													name='gender'
													value={form.gender}
													checked={form.gender == GENDER.NAM}
													onChange={(e) =>
														setForm((prev: any) => ({
															...prev,
															gender: GENDER.NAM,
														}))
													}
												/>
												<label className={styles.input_lable} htmlFor='male'>
													Nam
												</label>
											</div>

											<div className={styles.item_radio}>
												<input
													id='female'
													className={styles.input_radio}
													type='radio'
													name='gender'
													value={form.gender}
													checked={form.gender == GENDER.NU}
													onChange={(e) =>
														setForm((prev: any) => ({
															...prev,
															gender: GENDER.NU,
														}))
													}
												/>
												<label className={styles.input_lable} htmlFor='female'>
													Nữ
												</label>
											</div>

											<div className={styles.item_radio}>
												<input
													id='other'
													className={styles.input_radio}
													type='radio'
													name='gender'
													value={form.gender}
													checked={form.gender == GENDER.KHAC}
													onChange={(e) =>
														setForm((prev: any) => ({
															...prev,
															gender: GENDER.KHAC,
														}))
													}
												/>
												<label className={styles.input_lable} htmlFor='other'>
													Khác
												</label>
											</div>
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
												Số diện thoại<span style={{color: 'red'}}>*</span>
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
										name='CCCD'
										placeholder='Nhập số căn cước'
										value={form?.CCCD || null}
										onChange={(e: any) =>
											setForm((prev: any) => ({
												...prev,
												personnel: e.target.value,
											}))
										}
										label={
											<span>
												Chức vụ <span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										<Option title='Nhân viên 1' value={1} />
										<Option title='Nhân viên 2' value={2} />
										<Option title='Nhân viên 3' value={3} />
									</Select>
								</div>
								<Select
									isSearch
									name='CCCD'
									placeholder='Lựa chọn'
									value={form?.CCCD || null}
									onChange={(e: any) =>
										setForm((prev: any) => ({
											...prev,
											personnel: e.target.value,
										}))
									}
									label={
										<span>
											Thuộc team <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									<Option title='team 1' value={1} />
									<Option title='team 2' value={2} />
									<Option title='team 3' value={3} />
								</Select>
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
};

export default MainPageCreateStaff;
