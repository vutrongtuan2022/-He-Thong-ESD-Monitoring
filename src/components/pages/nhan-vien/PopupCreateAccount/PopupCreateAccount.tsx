import React, {useState} from 'react';

import {PropsPopupCreateAccount} from './interfaces';
import styles from './PopupCreateAccount.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import AvatarChange from '~/components/common/AvatarChange';

function PopupCreateAccount({onClose}: PropsPopupCreateAccount) {
	const [form, setForm] = useState<any>({code: '', name: '', description: ''});

	const handleSubmit = () => {
		console.log(form);
	};

	return (
		<div className={styles.container}>
			<h4>Thêm Tài khoản</h4>
			<p className={styles.p}>Điền đẩy đủ các thông tin cần thiết</p>
			<Form form={form} setForm={setForm}>
				<div className={'mb'}>
					<AvatarChange path={form?.avatar} name='avatar' />
				</div>
				<Input type='text' placeholder='Nhập tên nhân viên' name='code' label={<span>Tên nhân viên</span>} />
				<Input type='text' placeholder='Nhập tên tài khoản' name='name' label={<span>Tên tài khoản</span>} />

				<div className={'mt'}>
					<Select
						isSearch
						name=''
						placeholder='Lựa chọn'
						value={form?.CCCD || null}
						onChange={(e: any) =>
							setForm((prev: any) => ({
								...prev,
								personnel: e.target.value,
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
