import React, {useEffect, useState} from 'react';
import icons from '~/constants/images/icons';
import {PropsMainPageStaff} from './interfaces';
import styles from './MainPageStaff.module.scss';
import Search from '~/components/common/Search';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Select from '~/components/common/Select';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Dialog from '~/components/common/Dialog';
import Pagination from '~/components/common/Pagination';
import IconCustom from '~/components/common/IconCustom';
import Table from '~/components/common/Table';
import Button from '~/components/common/Button';
import {useRouter} from 'next/router';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import {LuCheck, LuPencil} from 'react-icons/lu';
import {Trash} from 'iconsax-react';
import Status from '~/components/common/Status';
import Popup from '~/components/common/Popup';
import HeadlessTippy from '@tippyjs/react/headless';
import {FaEye, FaRegEye} from 'react-icons/fa';
import Image from 'next/image';
import {CiLock} from 'react-icons/ci';
import ListTransmitter from '../ListTransmitter';
function MainPageStaff({}: PropsMainPageStaff) {
	const router = useRouter();
	const [OpenCreate, setOpenCreate] = useState<boolean>(false);
	const handleToggle = (index: number) => {
		setOpen((prev) => (prev === index ? null : index));
	};
	const [data, setData] = useState<any[]>([]);
	const {_page, _pageSize, _keyword, _manager, _dateFrom, _dateTo} = router.query;
	const [open, setOpen] = useState<number | null>(null);
	useEffect(() => {
		setData([
			{
				id: 1,
				name: 'name 1',
				index: 0,
				isChecked: false,
			},
			{
				id: 2,
				name: 'name 2',
				index: 1,
				isChecked: false,
			},
			{
				id: 3,
				name: 'name 3',
				index: 2,
				isChecked: false,
			},
		]);
	}, []);
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
						title: 'Danh sách nhân viên',
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
								href={PATH.ThemNhanvien}
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
				<ListTransmitter />
			</WrapperContainer>
		</div>
	);
}

export default MainPageStaff;
