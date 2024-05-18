import React, {useState} from 'react';
import Image from 'next/image';
import {PropsFormLogin} from './interfaces';
import styles from './FormLogin.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {Icon, ShieldSecurity, User} from 'iconsax-react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';
import {useRouter} from 'next/router';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import authServices from '~/services/authServices';
import Loading from '~/components/common/Loading';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import md5 from 'md5';
import {toastWarn} from '~/common/funcs/toast';
import {setStateLogin, setToken} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';
import ImageFill from '~/components/common/ImageFill';
import icons from '~/constants/images/icons';

function FormLogin({}: PropsFormLogin) {
	const router = useRouter();

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

	const {ip} = useSelector((state: RootState) => state.site);

	const [form, setForm] = useState<{username: string; password: string}>({username: '', password: ''});

	const login = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Đăng nhập thành công!',
				http: authServices.login({
					username: form.username,
					password: md5(form.password),
					ip: ip,
					address: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				store.dispatch(setToken(data.token));
				store.dispatch(
					setInfoUser({
						userName: data.userName,
						uuid: data.uuid,
						avatar: data.avatar,
						fullname: data.fullname,
						regencyUuid: data.regencyUuid,
						userUuid: data.userUuid,
					})
				);
				store.dispatch(setStateLogin(true));

				router.replace(PATH.Home, undefined, {scroll: false});

				console.log(data);
			}
		},
	});

	const handleSubmit = () => {
		// if (regex.test(form?.password) == false) {
		// 	return toastWarn({msg: 'Mật khẩu mới bao gồm tối thiểu 6 ký tự gồm chữ hoa, chữ thường và số.'});
		// }

		// login.mutate();
		// console.log();

		router.push(PATH.Home);
	};

	return (
		<div className={styles.container}>
			<Loading loading={login.isLoading} />
			<div className={styles.header}>

			<Image src={icons.logo} className={styles.logo_icon} alt='Logo' />
				<h4 className={styles.title}>ĐĂNG NHẬP TÀI KHOẢN</h4>
				<p className={styles.text}>Chào mừng bạn đến với hệ thống EDS monitoring . Đăng nhập để bắt đầu sử dụng</p>
			</div>

			<div className={styles.form}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<Input
						type='text'
						name='username'
						value={form?.username}
						placeholder='Tài khoản'
						onClean
						isRequired
						icon={<User size='20' variant='Bold' />}
						label={
							<span>
								Tài khoản <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						type='password'
						name='password'
						value={form?.password}
						placeholder='Mật khẩu'
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
									Mật khẩu <span style={{color: 'red'}}>*</span>
								</span>
								<Link
									href={PATH.ForgotPassword}
									style={{
										color: '#2367ED',
										fontSize: '14px',
										textDecoration: 'underline',
									}}
								>
									Quên mật khẩu?
								</Link>
							</div>
						}
					/>

					<div className={styles.rememberLogin}>
						<SwitchButton />
						<p className={styles.des}>Ghi nhớ đăng nhập</p>
					</div>

					<div className={styles.btn}>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button primary bold rounded_8 disable={!isDone}>
									Đăng nhập
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
