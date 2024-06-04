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
import {FaCalendarCheck, FaPhoneAlt} from 'react-icons/fa';
import {IoMdMail} from 'react-icons/io';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ShieldSecurity} from 'iconsax-react';
import clsx from 'clsx';
import ImageFill from '~/components/common/ImageFill';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import {httpRequest} from '~/services';
import Moment from 'react-moment';
import accountServices from '~/services/accountServices';
import md5 from 'md5';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import i18n from '~/locale/i18n';

function MainProfile({}: PropsMainProfile) {
	const queryClient = useQueryClient();

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [form, setForm] = useState<{oldPass: string; newPass: string; resPass: string}>({oldPass: '', newPass: '', resPass: ''});

	const {data: detailUser} = useQuery([QUERY_KEY.chi_tiet_nguoi_dung, infoUser?.uuid], {
		queryFn: () =>
			httpRequest({
				http: accountServices.accountDetail({
					uuid: infoUser?.uuid!,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!infoUser?.uuid,
	});

	const funcChangePass = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Profile.PasswordChangeSuccessful'),
				http: accountServices.changePassword({
					uuid: infoUser?.uuid!,
					oldPassword: md5(`${form?.oldPass}${process.env.NEXT_PUBLIC_KEY_PASS}`),
					newPassword: md5(`${form?.newPass}${process.env.NEXT_PUBLIC_KEY_PASS}`),
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({oldPass: '', newPass: '', resPass: ''});
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nguoi_dung]);
			}
		},
	});

	const handleSubmit = () => {
		if (regex.test(form?.newPass) == false) {
			return toastWarn({
				msg: i18n.t('Profile.TheNewPasswordMustBeAtLeast6CharactersLongAndIncludeUppercaseLowercaseLettersAndNumbers'),
			});
		}

		return funcChangePass.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcChangePass.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: '',
						title: i18n.t('Account.AccountDetails'),
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
								<p>{i18n.t('Account.AccountDetails')}</p>
							</Link>
							<p className={styles.des}>
								{i18n.t('Profile.Welcome')} <span style={{fontWeight: 600, color: '#23262f'}}>{detailUser?.fullName}</span>{' '}
								{i18n.t('Profile.TheESDMonitoring')}
							</p>
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
								href={`${PATH.Profile}/${detailUser?.uuid}`}
							>
								{i18n.t('Common.Update')}
							</Button>
						</div>
					</div>

					<div className={styles.main}>
						<div className={styles.box_info}>
							<ImageFill
								src={`${process.env.NEXT_PUBLIC_AVATAR}/${detailUser?.image}`}
								alt='anh dai dien'
								className={styles.avatar}
							/>
							<div className={styles.info}>
								<div className={styles.name}>
									<h5>{detailUser?.fullName}</h5>
									<div className={styles.role}>{detailUser?.regency || '---'}</div>
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<FaCalendarCheck />
									</div>
									{detailUser?.birthday ? <Moment date={detailUser?.birthday} format='DD/MM/YYYY' /> : '---'}
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<IoMdMail />
									</div>
									<p>{detailUser?.email}</p>
								</div>
								<div className={styles.item}>
									<div className={styles.icon}>
										<FaPhoneAlt />
									</div>
									<p>{detailUser?.phone}</p>
								</div>
							</div>
						</div>

						<div className={styles.line}></div>

						<div className={styles.changePass}>
							<h5>{i18n.t('Profile.ChangeThePassword')}</h5>
							<p>{i18n.t('Profile.YouCanChangeThePasswordAccording')}</p>
							<div className={styles.form}>
								<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
									<Input
										type='password'
										name='oldPass'
										value={form?.oldPass}
										placeholder={i18n.t('Profile.EnterOldPassword')}
										onClean
										isRequired
										icon={<ShieldSecurity size='20' variant='Bold' />}
										label={
											<span>
												{i18n.t('Profile.OldPassword')} <span style={{color: 'red'}}>*</span>
											</span>
										}
									/>

									<div className={clsx('mt', 'col_2')}>
										<Input
											type='password'
											name='newPass'
											value={form?.newPass}
											placeholder={i18n.t('Profile.EnterNewPassword')}
											onClean
											isRequired
											icon={<ShieldSecurity size='20' variant='Bold' />}
											label={
												<span>
													{i18n.t('Profile.EnterNewPassword')} <span style={{color: 'red'}}>*</span>
												</span>
											}
										/>

										<div>
											<Input
												type='password'
												name='resPass'
												value={form?.resPass}
												valueConfirm={form?.newPass}
												placeholder={i18n.t('Profile.EnterThePassword')}
												onClean
												isRequired
												icon={<ShieldSecurity size='20' variant='Bold' />}
												label={
													<span>
														{i18n.t('Profile.ConfirmNewPassword')} <span style={{color: 'red'}}>*</span>
													</span>
												}
											/>
										</div>
									</div>

									<div className={styles.btn}>
										<FormContext.Consumer>
											{({isDone}) => (
												<Button primary bold rounded_8 disable={!isDone}>
													{i18n.t('Profile.ChangePassword')}
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
