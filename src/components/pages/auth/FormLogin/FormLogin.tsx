import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {PropsFormLogin} from './interfaces';
import styles from './FormLogin.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ShieldSecurity, User} from 'iconsax-react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';
import {useRouter} from 'next/router';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import authServices from '~/services/authServices';
import Loading from '~/components/common/Loading';
import {RootState, store} from '~/redux/store';
import {toastWarn} from '~/common/funcs/toast';
import {setDataLoginStorage, setStateLogin, setToken} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';
import icons from '~/constants/images/icons';
import {useSelector} from 'react-redux';
import {setRememberPassword} from '~/redux/reducer/site';
import i18n from '~/locale/i18n';

function FormLogin({}: PropsFormLogin) {
	const router = useRouter();

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const {isRememberPassword} = useSelector((state: RootState) => state.site);
	const {dataLoginStorage} = useSelector((state: RootState) => state.auth);

	const [form, setForm] = useState<{username: string; password: string}>({username: '', password: ''});

	useEffect(() => {
		if (isRememberPassword) {
			setForm({
				username: dataLoginStorage?.usernameStorage || '',
				password: dataLoginStorage?.passwordStorage || '',
			});
		} else {
			setForm({
				username: '',
				password: '',
			});
		}
	}, []);

	const login = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Login.Dangnhapthanhcong'),
				http: authServices.login({
					userName: form.username,
					password: form.password,
				}),
			}),
		onSuccess(data) {
			if (data) {
				store.dispatch(setToken(data.token));
				store.dispatch(setInfoUser(data));
				store.dispatch(setStateLogin(true));
				router.replace(PATH.Home, undefined, {scroll: false});
				store.dispatch(
					setDataLoginStorage({
						usernameStorage: form.username,
						passwordStorage: form.password,
					})
				);
			}
		},
	});

	const handleSubmit = () => {
		// if (regex.test(form?.password) == false) {
		// 	return toastWarn({msg: 'Mật khẩu mới bao gồm tối thiểu 6 ký tự gồm chữ hoa, chữ thường và số.'});
		// }

		if (isRememberPassword) {
			store.dispatch(
				setDataLoginStorage({
					usernameStorage: form.username,
					passwordStorage: form.password,
				})
			);
		} else {
			store.dispatch(setDataLoginStorage(null));
		}

		return login.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={login.isLoading} />
			<div className={styles.header}>
				<Image src={icons.logo} className={styles.logo_icon} alt='Logo' />
				<h4 className={styles.title}>{i18n.t('Login.Dangnhaptaikhoan')}</h4>
				<p className={styles.text}>{i18n.t('Login.ChaomungbandenvoihethongEDS')}</p>
			</div>

			<div className={styles.form}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<Input
						type='text'
						name='username'
						value={form?.username}
						placeholder={i18n.t('Login.Taikhoan')}
						onClean
						isRequired
						icon={<User size='20' variant='Bold' />}
						label={
							<span>
								{i18n.t('Login.Taikhoan')} <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						type='password'
						name='password'
						value={form?.password}
						placeholder={i18n.t('Login.Matkhau')}
						onClean
						isRequired
						icon={<ShieldSecurity size='20' variant='Bold' />}
						label={
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<span>
								{i18n.t('Login.Matkhau')}<span style={{color: 'red'}}>*</span>
								</span>
							</div>
						}
					/>

					<div className={styles.rememberLogin}>
						<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
							<SwitchButton
								name='isRememberPassword'
								value={isRememberPassword}
								onChange={() => store.dispatch(setRememberPassword(!isRememberPassword))}
							/>
							<p className={styles.des}>{i18n.t('Login.Ghinhodangnhap')}</p>
						</div>

						<Link
							href={PATH.ForgotPassword}
							style={{
								color: '#2367ED',
								fontSize: '14px',
								textDecoration: 'underline',
							}}
						>
							{i18n.t('Login.Quenmatkhau')}
						</Link>
					</div>

					<div className={styles.btn}>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button primary bold rounded_8 disable={!isDone}>
									{i18n.t('Common.Dangnhap')}
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default FormLogin;
