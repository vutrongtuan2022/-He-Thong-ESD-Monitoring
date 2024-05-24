import React, {useState} from 'react';
import {PropsUpdateAccount} from './interfaces';
import styles from './UpdateAccount.module.scss';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import Breadcrumb from '~/components/common/Breadcrumb';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Popup from '~/components/common/Popup';
import {IoClose} from 'react-icons/io5';
import {IoMdAddCircle} from 'react-icons/io';
import {GENDER} from '~/constants/config/enum';
import DatePicker from '~/components/common/DatePicker';
import AvatarChange from '~/components/common/AvatarChange';
// import PopupPersonnel from '../PopupPersonnel';

const UpdateAccount = ({}: PropsUpdateAccount) => {
	const [date, setDate] = useState<string>('');
	const [form, setForm] = useState<any>({
		avatar: '',
		name: '',
		email: '',
		phone: '',
		position: '',
		level: '',
		account: '',
		manager: '',
		address: '',
	});

	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						title: 'Trang chủ',
						path: PATH.Home,
					},
					{
						title: 'Quản lý tài khoản',
						path: PATH.TaiKhoan,
					},
					{
						title: 'Chỉnh sửa tài khoản',
						path: '',
					},
				]}
			/>
			<WrapperContainer>
				<div className={styles.main_page}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>Chỉnh sửa tài khoản</h4>
							<p>Chỉnh sửa thông tin tài khoản</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.TaiKhoan} p_10_24 rounded_2 grey_outline>
								Hủy bỏ
							</Button>
							<Button p_10_24 rounded_2 primary>
								Lưu lại
							</Button>
						</div>
					</div>

					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<div className={'mb'}>
								<AvatarChange path={form?.avatar} name='avatar' />
							</div>

							<div className={clsx('mt', 'col_2')}>
								<Input
									name='name'
									value={form.name || ''}
									label={
										<span>
											<b>Họ và tên</b> <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập họ tên'
								/>
								<div className={clsx('col_2')}>
									<DatePicker
										icon={true}
										label={
											<span>
												<b>Ngày sinh </b>
												<span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Chọn ngày sinh'
										value={date}
										onSetValue={setDate}
										name='dateOfBirth'
										onClean={true}
									/>
									<div className={styles.gennder}>
										<label>
											<span>
												<b>Giới tính</b>
												<span style={{color: 'red'}}>*</span>
											</span>
										</label>
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
											<b>Email</b> <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập email'
									readOnly
								/>
								<div>
									<Input
										name='phone'
										value={form.phone || ''}
										label={
											<span>
												<b>Số diện thoại </b>
												<span style={{color: 'red'}}>*</span>
											</span>
										}
										placeholder='Nhập số diện thoại'
									/>
								</div>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<Select
									isSearch
									name='position'
									value={form.position || null}
									placeholder='Chọn chức vụ'
									onChange={(position) =>
										setForm((prev: any) => ({
											...prev,
											position: position,
										}))
									}
									label={
										<span>
											Chức vụ<span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									<Option title='Admin' value={1} />
									<Option title='User' value={2} />
								</Select>
								<div>
									<Select
										isSearch
										name='level'
										value={form.level || null}
										placeholder='Cấp độ'
										onChange={(level) =>
											setForm((prev: any) => ({
												...prev,
												level: level,
											}))
										}
										label={
											<span>
												Chọn cấp độ<span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										<Option title='1' value={1} />
										<Option title='2' value={2} />
									</Select>
								</div>
							</div>
							<div className={clsx('mt', 'col_2')}>
								<Input
									name='account'
									value={form.account || ''}
									label={
										<span>
											<b>Tên tài khoản</b> <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập tên tài khoản/email'
									readOnly
								/>
								<div>
									<Select
										isSearch
										name='manager'
										value={form.manager || null}
										placeholder='Lựa chọn'
										onChange={(manager) =>
											setForm((prev: any) => ({
												...prev,
												manager: manager,
											}))
										}
										label={
											<span>
												<b>Người quản lý</b>
												<span style={{color: 'red'}}>*</span>
											</span>
										}
									>
										<Option title='Nguyễn văn A' value={1} />
										<Option title='Trần văn B' value={2} />
									</Select>
								</div>
							</div>
							<div className={clsx('mt')}>
								<Input
									name='address'
									value={form.address || ''}
									label={
										<span>
											<b>Địa chỉ chi tiết</b>
										</span>
									}
									placeholder='Nhập địa chỉ chi tiết'
								/>
							</div>
						</Form>
					</div>

					{/* POPUP */}
				</div>
			</WrapperContainer>
		</div>
	);
};

export default UpdateAccount;
