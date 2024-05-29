import React, {useState} from 'react';

import {PropsPopupCreateAccount} from './interfaces';
import styles from './PopupCreateAccount.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import AvatarChange from '~/components/common/AvatarChange';

function PopupCreateAccount({dataCreateAccount, onClose}: PropsPopupCreateAccount) {
	const [form, setForm] = useState<{
		avatar: string;
		fullName: string;
		userName: string;
		roleUuid: string;
	}>({avatar: '', fullName: '', userName: '', roleUuid: ''});

	const handleSubmit = () => {
		console.log(form);
	};

	return (
		<div className={styles.container}>
			<h4>Cấp tài khoản </h4>
			<p className={styles.p}>Điền đẩy đủ các thông tin cần thiết</p>
			<Form form={form} setForm={setForm}>
				<div className={'mb'}>
					<AvatarChange path={form?.avatar} name='avatar' />
				</div>
				<Input
					type='text'
					placeholder='Nhập tên nhân viên'
					name='fullName'
					value={form.fullName}
					label={
						<span>
							Tên nhân viên <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>
				<Input
					type='text'
					placeholder='Nhập tên tài khoản'
					name='userName'
					value={form.userName}
					label={
						<span>
							Tên tài khoản <span style={{color: 'red'}}>*</span>
						</span>
					}
				/>

				<div className={'mt'}>
					<Select
						isSearch
						name=''
						placeholder='Lựa chọn'
						value={form?.roleUuid || null}
						onChange={(e: any) =>
							setForm((prev: any) => ({
								...prev,
								roleUuid: e.target.value,
							}))
						}
						label={
							<span>
								Vai trò <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						<Option title='Nhân viên 1' value={1} />
						<Option title='Nhân viên 2' value={2} />
						<Option title='Nhân viên 3' value={3} />
					</Select>
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_6 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<Button p_10_24 rounded_6 primary onClick={handleSubmit}>
							Xác nhận
						</Button>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default PopupCreateAccount;
