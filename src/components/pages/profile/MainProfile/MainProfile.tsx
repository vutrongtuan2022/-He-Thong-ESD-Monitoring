import React, {useState} from 'react';
import Image from 'next/image';

import {PropsMainProfile} from './interfaces';
import styles from './MainProfile.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import {BsThreeDots} from 'react-icons/bs';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import Link from 'next/link';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {FaCalendarCheck, FaMapMarkerAlt} from 'react-icons/fa';
import {IoMdMail} from 'react-icons/io';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ShieldSecurity} from 'iconsax-react';
import clsx from 'clsx';
import ImageFill from '~/components/common/ImageFill';

function MainProfile({}: PropsMainProfile) {
	const [form, setForm] = useState<any>({oldPass: '', newPass: ''});

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
						title: 'Chi tiết tài khoản',
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
						<div>
							<Link href={PATH.Home} className={styles.header_title}>
								<IoArrowBackOutline fontSize={24} fontWeight={600} />
								<p>Chi tiết tài khoản</p>
							</Link>
							<p className={styles.des}>Chào mừng Dương Mĩ linh đến với hệ thống quản lý Thái Hưng</p>
						</div>
						<div className={styles.list_btn}>
							<Button
								className={styles.btn}
								rounded_4
								w_fit
								p_10_24
								primary
								bold
								icon={<Image alt='icon import' src={icons.icon_edit} width={20} height={20} />}
								href={`${PATH.Profile}/123`}
							>
								Cập nhật
							</Button>
						</div>
					</div>

					<div className={styles.main}>
						<div className={styles.box_info}>
							<ImageFill src={''} alt='anh dai dien' className={styles.avatar} />
							<div className={styles.info}>
								<div className={styles.name}>
									<h5>Dương Mĩ Linh</h5>
									<div className={styles.role}>Chức vụ</div>
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<FaCalendarCheck />
									</div>
									<p>24/08/1986</p>
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<IoMdMail />
									</div>
									<p>Duongmilinh23@gmail.com</p>
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<FaMapMarkerAlt />
									</div>
									<p>Số 219 Đường Nguyễn Văn Cừ, Phường Hồng Hà, Thành phố Hạ Long, Tỉnh Quảng Ninh</p>
								</div>
							</div>
						</div>

						<div className={styles.line}></div>

						<div className={styles.changePass}>
							<h5>Thay đổi mật khẩu</h5>
							<p>Bạn có thể thay đổi mật khẩu theo ý muốn của bạn. Mật khẩu thay đổi không trùng với mật khẩu cũ.</p>

							<div className={styles.form}>
								<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
									<Input
										type='password'
										name='oldPass'
										value={form?.oldPass}
										placeholder='Nhập mật khẩu cũ'
										onClean
										isRequired
										icon={<ShieldSecurity size='20' variant='Bold' />}
										label={
											<span>
												Mật khẩu cũ <span style={{color: 'red'}}>*</span>
											</span>
										}
									/>

									<div className={clsx('mt', 'col_2')}>
										<Input
											type='password'
											name='newPass'
											value={form?.newPass}
											placeholder='Nhập mật khẩu mới'
											onClean
											isRequired
											icon={<ShieldSecurity size='20' variant='Bold' />}
											label={
												<span>
													Nhập mật khẩu mới <span style={{color: 'red'}}>*</span>
												</span>
											}
										/>

										<div>
											<Input
												type='password'
												name='newPass'
												value={form?.newPass}
												valueConfirm={form?.newPass}
												placeholder='Nhập lại mật khẩu'
												onClean
												isRequired
												icon={<ShieldSecurity size='20' variant='Bold' />}
												label={
													<span>
														Xác nhận mật khẩu mới <span style={{color: 'red'}}>*</span>
													</span>
												}
											/>
										</div>
									</div>

									<div className={styles.btn}>
										<FormContext.Consumer>
											{({isDone}) => (
												<Button primary bold rounded_8 disable={!isDone}>
													Đổi mật khẩu
												</Button>
											)}
										</FormContext.Consumer>
									</div>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</WrapperContainer>
		</div>
	);
}

export default MainProfile;
