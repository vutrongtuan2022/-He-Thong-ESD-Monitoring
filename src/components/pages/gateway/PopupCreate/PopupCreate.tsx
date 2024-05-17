import React, {useState} from 'react';

import {PropsPopupCreate} from './interfaces';
import styles from './PopupCreate.module.scss';
import {GrSearch} from 'react-icons/gr';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import Form, {Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';

function PopupCreate({onClose}: PropsPopupCreate) {
	const [keyword, setKeyword] = useState<string>('');
	const [form, setForm] = useState<any>({code: '', name: '', description: ''});
	const handleSubmit = () => {
		console.log(form);
	};

	return (
		<div className={styles.container}>
			<h4>Thêm mới gateway</h4>
			<Form form={form} setForm={setForm}>
				<Input
					type='text'
					placeholder='Nhập ID gateway'
					name='code'
					label={
						<span>
							ID gateway <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<Input
					type='text'
					placeholder='Nhập tên loại hàng'
					name='name'
					label={
						<span>
							Tên gateway <span style={{color: 'red'}}>*</span>{' '}
						</span>
					}
				/>
				<div className={clsx('mt')}>
					<TextArea placeholder='Nhập ghi chú' name='description' label={<span>Ghi chú</span>} blur />
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

export default PopupCreate;
