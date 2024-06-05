import React, {useContext} from 'react';

import {PropsFormPassword} from './interfaces';
import styles from './FormPassword.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ContextForgotPassword, IContextForgotPassword} from '../context';
import Button from '~/components/common/Button';
import {ShieldSecurity} from 'iconsax-react';
import Popup from '~/components/common/Popup';
import {useRouter} from 'next/router';
import FormSusses from '../FormSusses';
import i18n from '~/locale/i18n';

function FormPassword({}: PropsFormPassword) {
	const router = useRouter();

	const {open, ...rest} = router.query;

	const context = useContext<IContextForgotPassword>(ContextForgotPassword);

	const handleSubmit = () => {
		router.replace(
			{
				query: {...router.query, open: 'susses'},
			},
			undefined,
			{scroll: false}
		);
	};

	return (
		<div>
			<Form form={context.form} setForm={context.setForm} onSubmit={handleSubmit}>
				<Input
					type='password'
					name='password'
					value={context?.form?.password}
					placeholder={i18n.t('ForgotPass.EnterNewPassword')}
					onClean
					isRequired
					icon={<ShieldSecurity size='20' variant='Bold' />}
					label={
						<span>
							{i18n.t('ForgotPass.NewPassword')} <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<Input
					type='password'
					name='rePassword'
					value={context?.form?.rePassword}
					valueConfirm={context?.form?.password}
					placeholder={i18n.t('ForgotPass.ReEnterPassword')}
					onClean
					isRequired
					icon={<ShieldSecurity size='20' variant='Bold' />}
					label={
						<span>
							{i18n.t('ForgotPass.ConfirmNewPassword')}
							<span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={styles.btn}>
					<FormContext.Consumer>
						{({isDone}) => (
							<Button primary bold rounded_8 disable={!isDone}>
								{i18n.t('ForgotPass.SavePassword')}
							</Button>
						)}
					</FormContext.Consumer>
				</div>
			</Form>

			<Popup
				open={open == 'susses'}
				onClose={() =>
					router.replace(
						{
							query: rest,
						},
						undefined,
						{scroll: false}
					)
				}
			>
				<FormSusses />
			</Popup>
		</div>
	);
}

export default FormPassword;
