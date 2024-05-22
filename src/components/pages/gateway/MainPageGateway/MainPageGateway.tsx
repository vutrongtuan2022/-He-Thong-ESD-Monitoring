import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import {PropsMainPageGateway} from './interfaces';
import styles from './MainPageGateway.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Dialog from '~/components/common/Dialog';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import Popup from '~/components/common/Popup';
import PopupCreate from '../PopupCreate';
import Image from 'next/image';
import ListTransmitterMainPage from '../ListTransmitterMainPage';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import {QUERY_KEY, STATUS_GATEWAY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import ImportExcel from '~/components/common/ImportExcel';

function MainPageGateway({}: PropsMainPageGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {importExcel, _page, _pageSize, _keyword, _state, _factoryAreaUuid} = router.query;

	const [file, setFile] = useState<any>(null);
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);

	// Func export excel
	const exportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				http: gatewayServices.exportExcel({
					pageSize: Number(_pageSize) || 20,
					page: Number(_page) || 1,
					keyword: _keyword ? (_keyword as string) : '',
					state: _state ? Number(_state) : null,
					factoryAreaUuid: (_factoryAreaUuid as string) || '',
					status: STATUS_GATEWAY.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				window.open(`${process.env.NEXT_PUBLIC_PATH_EXPORT}/${data}`, '_blank');
			}
		},
	});

	// Func import excel
	const fucnImportExcel = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Import file thành công!',
				http: gatewayServices.importExcel({
					FileData: file,
					Type: 1,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				handleCloseImportExcel();
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _factoryAreaUuid]);
			}
		},
	});

	// Close popup import excel
	const handleCloseImportExcel = () => {
		const {importExcel, ...rest} = router.query;

		setFile(null);
		router.replace(
			{
				query: rest,
			},
			undefined,
			{scroll: false}
		);
	};

	const handleExportExcel = async () => {
		exportExcel.mutate();
	};

	const handleImportExcel = async () => {
		fucnImportExcel.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={exportExcel.isLoading} />

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
								onClick={handleExportExcel}
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
								onClick={() =>
									router.replace(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												importExcel: 'open',
											},
										},
										undefined,
										{
											scroll: false,
											shallow: false,
										}
									)
								}
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
				<ListTransmitterMainPage onOpenCreate={() => setOpenCreate(true)} />
				<Dialog
					danger
					open={openDelete}
					onClose={() => setOpenDelete(false)}
					title='Xóa Gateway'
					note='Bạn có chắc chắn muốn xóa gateway này?'
					onSubmit={() => setOpenDelete(false)}
				/>
			</WrapperContainer>
			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreate onClose={() => setOpenCreate(false)} />
			</Popup>
			<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-device'
					file={file}
					pathTemplate='/static/files/Mau_Import_Gateway.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={handleImportExcel}
				/>
			</Popup>
		</div>
	);
}

export default MainPageGateway;
