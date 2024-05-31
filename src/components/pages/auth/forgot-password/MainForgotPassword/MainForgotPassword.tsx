import React, {useState} from 'react';

import {IForm, PropsMainForgotPassword} from './interfaces';
import styles from './MainForgotPassword.module.scss';
import {ContextForgotPassword} from '../context';
import FormEmail from '../FormEmail';
import FormPassword from '../FormPassword';
import i18n from '~/locale/i18n';

function MainForgotPassword({}: PropsMainForgotPassword) {
	const [type, setType] = useState<number>(0);
	const [form, setFrom] = useState<IForm>({
		email: '',
		otp: '',
		password: '',
		rePassword: '',
	});

	const arrText: {
		title: string;
		des: string;
	}[] = [
		{
			title: i18n.t('ForgotPass.Quenmatkhau'),
			des: i18n.t('ForgotPass.NhapdiachiEmaillienketvoitaikhoancuaban'),
		},
		{
			title: i18n.t('ForgotPass.Thietlapmatkhau'),
			des: i18n.t('ForgotPass.Matkhaumoibaogomchuhoachuthuongvaso'),
		},
	];

	return (
		<div className={styles.container}>
			<h4 className={styles.title}>{arrText?.[type]?.title}</h4>
			<p className={styles.text}>{arrText?.[type]?.des}</p>

			<div className={styles.main}>
				<ContextForgotPassword.Provider
					value={{
						form: form,
						setForm: setFrom,
						type: type,
						setType: setType,
					}}
				>
					{type == 0 && <FormEmail />}
					{type == 1 && <FormPassword />}
				</ContextForgotPassword.Provider>
			</div>
		</div>
	);
}

export default MainForgotPassword;
