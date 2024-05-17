import React, {useState} from 'react';

import {IForm, PropsFormCreateTransmitter} from './interfaces';
import styles from './FormCreateTransmitter.module.scss';
import Form, {Input} from '~/components/common/Form';
import Select, {Option} from '~/components/common/Select';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';

function FormCreateTransmitter({onClose}: PropsFormCreateTransmitter) {
	const [form, setForm] = useState<IForm>({
		mac: '',
		name: '',
		team: '',
	});

	const handleSubmit = () => {};

	return (
		<div className={styles.container}>
			<h4>Thêm mới bộ phát</h4>
			<Form form={form} setForm={setForm}>
				<Input
					label={
						<span>
							Số MAC thiết bị <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder='Nhập số mac cho thiết bị'
					name='mac'
					value={form.mac}
					type='text'
				/>
				<Input
					label={
						<span>
							Tên thiết bị <span style={{color: 'red'}}>*</span>
						</span>
					}
					placeholder='Nhập tên mới cho thiết bị'
					name='name'
					value={form.name}
					type='text'
				/>
				<div className='mt'></div>
				<Select
					name='team'
					value={form.team}
					placeholder='Lựa chọn'
					onChange={(e) =>
						setForm((prev) => ({
							...prev,
							team: e.target.value,
						}))
					}
					label={
						<span>
							Thuộc team <span style={{color: 'red'}}>*</span>
						</span>
					}
				>
					<Option title='Team 1' value={1} />
					<Option title='Team 2' value={2} />
				</Select>

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

export default FormCreateTransmitter;
