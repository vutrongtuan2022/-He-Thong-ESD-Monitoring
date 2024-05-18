import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import {PropsMainPageGateway} from './interfaces';
import styles from './MainPageGateway.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import Popup from '~/components/common/Popup';
import PopupCreate from '../PopupCreate';
import Image from 'next/image';
import ListTransmitterMainPage from '../ListTransmitterMainPage';
function MainPageGateway({}: PropsMainPageGateway) {
	const router = useRouter();
	const [OpenCreate, setOpenCreate] = useState<boolean>(false);

	const {_page, _pageSize, _keyword, _manager, _dateFrom, _dateTo} = router.query;
	const [openDelete, setOpenDelete] = useState<boolean>(false);
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
						title: 'Danh sách gateway',
					},
				]}
				action={
					<div className={styles.main_action}>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								green
								bold
								icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
							>
								Export excel
							</Button>
						</div>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								blue_light
								bold
								icon={<Image alt='icon import' src={icons.import_excel} width={20} height={20} />}
							>
								Import excel
							</Button>
						</div>
						<div>
							<Button
								className={styles.btn}
								rounded_8
								w_fit
								p_6_16
								primary
								bold
								icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
								onClick={() => setOpenCreate(true)}
							>
								Thêm mới
							</Button>
						</div>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<ListTransmitterMainPage />
				<Dialog
					danger
					open={openDelete}
					onClose={() => setOpenDelete(false)}
					title='Xóa Gateway'
					note='Bạn có chắc chắn muốn xóa gateway này?'
					onSubmit={() => setOpenDelete(false)}
				/>
			</WrapperContainer>
			<Popup open={OpenCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreate onClose={() => setOpenCreate(false)} />
			</Popup>
		</div>
	);
}

export default MainPageGateway;
