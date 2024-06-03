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
import {GENDER} from '~/constants/config/enum';
import DatePicker from '~/components/common/DatePicker';
import AvatarChange from '~/components/common/AvatarChange';

function MainEditProfile({}: PropsMainEditProfile) {
	const [form, setForm] = useState<any>({
		avatar: '',
		date: '',
		name: '',
		email: '',
		phone: '',
		province: '',
		district: '',
		ward: '',
		address: '',
		role: '',
		position: '',
		gender: null,
	});

	const handleSubmit = () => {};

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: 'Trang chủ',
					},
					{
						path: '',
						title: 'Chỉnh sửa tài khoản',
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
							<h4>Chỉnh sửa người dùng</h4>
							<p>Điền đầy đủ các thông tin người dùng</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.Profile} p_10_24 rounded_2 grey_outline>
								Hủy bỏ
							</Button>
							<Button p_10_24 rounded_2 primary>
								Cập nhật
							</Button>
						</div>
					</div>

					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<div className={'mb'}>
								<AvatarChange path={form?.avatar} name='avatar' />
							</div>
							<Input
								name='name'
								value={form.name || ''}
								label={
									<span>
										Họ và tên <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tên người dùng'
							/>
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
												Số điện thoại<span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số điện thoại'
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<DatePicker
									icon={true}
									label={'Ngày sinh'}
									placeholder='Chọn ngày sinh'
									value={form.date}
									onSetValue={(date) =>
										setForm((prev: any) => ({
											...prev,
											date: date,
										}))
									}
									name='dateOfBirth'
									onClean={true}
								/>
								<div className={styles.gennder}>
									<label>Giới tính</label>
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
									</div>
								</div>
							</div>

							<div className={clsx('col_2', 'mt')}>
								<Select
									isSearch
									name='position'
									value={form.position || null}
									placeholder='Chức vụ'
									onChange={(position) =>
										setForm((prev: any) => ({
											...prev,
											position: position,
										}))
									}
									label={<span>Chức vụ</span>}
								>
									<Option title='Chức vụ 1' value={1} />
									<Option title='Chức vụ 2' value={2} />
								</Select>
								<div>
									<Select
										isSearch
										name='role'
										value={form.role || null}
										placeholder='Vai trò'
										onChange={(role) =>
											setForm((prev: any) => ({
												...prev,
												role: role,
											}))
										}
										label={<span>Vai trò</span>}
									>
										<Option title='Vai trò 1' value={1} />
										<Option title='Vai trò 2' value={2} />
									</Select>
								</div>
							</div>

							<div className={clsx('mt')}>
								<Input
									name='address'
									value={form.address || ''}
									label={<span>Địa chỉ chi tiết</span>}
									placeholder='Nhập địa chỉ chi tiết'
								/>
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainEditProfile;
