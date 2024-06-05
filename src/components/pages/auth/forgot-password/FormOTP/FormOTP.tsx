import React, {useContext, useEffect, useState} from 'react';

import {PropsFormOTP} from './interfaces';
import styles from './FormOTP.module.scss';
import InputSingle from '~/components/common/InputSingle';
import {ContextForgotPassword, IContextForgotPassword} from '../context';
import clsx from 'clsx';
import fancyTimeFormat from '~/common/funcs/fancyTimeFormat';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import {obfuscateEmail} from '~/common/funcs/optionConvert';
import i18n from '~/locale/i18n';
import {IoClose} from 'react-icons/io5';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import accountServices from '~/services/accountServices';
import Loading from '~/components/common/Loading';

function FormOTP({}: PropsFormOTP) {
	const TIME_OTP = 60;

	const router = useRouter();
	const {open, ...rest} = router.query;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const [countDown, setCoutDown] = useState<number>(TIME_OTP);

	// Đếm ngược thời gian gửi lại code
	useEffect(() => {
		if (countDown > 0) {
			const time = setTimeout(() => {
				setCoutDown(countDown - 1);
			}, 1000);
			return () => clearInterval(time);
		}
	}, [countDown]);

	// Gửi lại OTP
	const funcSendOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('ForgotPass.MessageSendOTP'),
				http: accountServices.sendOTP({
					email: context?.form?.email!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setCoutDown(TIME_OTP);
			}
		},
	});

	// FUCN submit OTP
	const funcSubmitOTP = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('ForgotPass.VerifyOTPSucsses'),
				http: accountServices.enterOTP({
					email: context?.form?.email!,
					otp: context?.form?.otp!,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				context?.setType(1);
				router.replace(
					{
						query: rest,
					},
					undefined,
					{scroll: false}
				);
			}
		},
	});

	const handleSendcode = () => {
		return funcSendOTP.mutate();
	};

	const handleSubmit = () => {
		return funcSubmitOTP.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcSendOTP.isLoading || funcSubmitOTP.isLoading} />
			<h4 className={styles.title}>{i18n.t('ForgotPass.VerifyOTPCode')}</h4>
			<p className={styles.text}>
				{i18n.t('ForgotPass.TextSendOTPForgotPass')}
				<span>{obfuscateEmail(context?.form?.email!)}</span>
			</p>

			<div className={styles.form}>
				<p className={styles.des}>{i18n.t('ForgotPass.EnterOTPCode')}</p>
				<div className={styles.box_code}>
					<InputSingle onSetValue={context.setForm} name='otp' lenght={6} />
				</div>
				<p className={styles.countDown}>
					{i18n.t('ForgotPass.DidntReceiveTheCode')}{' '}
					{countDown > 0 ? (
						<span className={clsx(styles.textGreen, styles.btnOtp)}>
							{i18n.t('ForgotPass.ResendOTP')}({fancyTimeFormat(countDown)})
						</span>
					) : (
						<span className={clsx(styles.textGreen, styles.btnOtp)} onClick={handleSendcode}>
							{i18n.t('ForgotPass.ResendOTP')}
						</span>
					)}
				</p>

				<div className={styles.btn}>
					<Button primary bold rounded_8 disable={context?.form?.otp?.length! < 6} onClick={handleSubmit}>
						{i18n.t('ForgotPass.VerifyEmail')}
					</Button>
				</div>

				<div
					className={styles.close}
					onClick={() =>
						router.replace(
							{
								query: rest,
							},
							undefined,
							{scroll: false}
						)
					}
				>
					<IoClose />
				</div>
			</div>
		</div>
	);
}

export default FormOTP;
