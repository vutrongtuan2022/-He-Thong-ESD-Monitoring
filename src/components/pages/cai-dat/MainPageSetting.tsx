import React, {useState} from 'react';
import {PropsMainPageSetting} from './interfaces';
import styles from './MainPageSetting.module.scss';
import {BsThreeDots} from 'react-icons/bs';
import {PATH} from '~/constants/config';
import Breadcrumb from '~/components/common/Breadcrumb';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Button from '~/components/common/Button';
import {clsx} from 'clsx';
import Input from '~/components/common/Form/components/Input';
import Form from '~/components/common/Form';
const MainPageSetting = ({}: PropsMainPageSetting) => {
	const [form, setForm] = useState<any>({
		avatar: '',
		name: '',
		email: '',
		phone: '',
		position: '',
		level: '',
		account: '',
		manager: '',
		address: '',
	});
	return (
		<div className={styles.container}>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: 'Trang chủ',
					},
					{
						path: '',
						title: 'Cài đặt',
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
				<Form form={form} setForm={setForm}>
					<div className={styles.main_page}>
						<div className={styles.header}>
							<div className={styles.left}>
								<h4>Cài đặt</h4>
								<p>Điền đầy đủ các thông tin </p>
							</div>
							<div className={styles.right}>
								<Button p_10_24 rounded_4 primary>
									Lưu lại
								</Button>
							</div>
						</div>
						<div className={styles.form}>
							<div className={clsx('mt')}>
								<Input
									name='name'
									value={form.name || ''}
									label={
										<span>
											Thời gian ghi nhận NG (phút/giây) <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='00:00'
								/>
							</div>
						</div>
					</div>
				</Form>
			</WrapperContainer>
			{/* <Popup open={OpenCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreate onClose={() => setOpenCreate(false)} />
			</Popup> */}
		</div>
	);
};

export default MainPageSetting;
