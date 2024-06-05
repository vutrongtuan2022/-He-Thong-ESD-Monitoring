import React, {useState} from 'react';
import icons from '~/constants/images/icons';
import {PropsMainGateway} from './interfaces';
import styles from './MainGateway.module.scss';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Button from '~/components/common/Button';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import Popup from '~/components/common/Popup';
import PopupCreateGateway from '../PopupCreateGateway';
import Image from 'next/image';
import ListGateway from '../ListGateway';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import gatewayServices from '~/services/gatewayServices';
import {QUERY_KEY} from '~/constants/config/enum';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import ImportExcel from '~/components/common/ImportExcel';
import {toastWarn} from '~/common/funcs/toast';
import i18n from '~/locale/i18n';

interface IDataExcelGetway {
	code: string;
	name: string;
	factoryArea: string;
	notes: string;
}

function MainGateway({}: PropsMainGateway) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {importExcel, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid} = router.query;

	const [file, setFile] = useState<any>(null);
	const [dataExcel, setDataExcel] = useState<any[]>([]);
	const [openCreate, setOpenCreate] = useState<boolean>(false);

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
					status: _status ? Number(_status) : null,
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
				queryClient.invalidateQueries([QUERY_KEY.danh_sach_gateway, _page, _pageSize, _keyword, _state, _status, _factoryAreaUuid]);
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
		const dataConvert: IDataExcelGetway[] = dataExcel?.map((v: any) => ({
			code: v['Mã gateway'],
			name: v['Tên gateway'],
			factoryArea: v['Mã khu vực quản lý'],
			notes: v['Ghi chú'],
		}));

		// Check require code, name
		const isValid = dataConvert.every((item) => item.code && item.name);

		if (!isValid) {
			return toastWarn({msg: i18n.t('Common.DataInputIncorect')});
		}

		for (let index = 0; index < dataConvert.length; index++) {
			if (dataConvert[index]?.code == dataConvert[index + 1]?.code) {
				return toastWarn({msg: i18n.t('Common.DataInputIncorect')});
			}
		}

		return fucnImportExcel.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={fucnImportExcel.isLoading || exportExcel.isLoading} />
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: '',
						title: i18n.t('Gateway.GatewayList'),
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
								{i18n.t('Common.Addnew')}
							</Button>
						</div>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<ListGateway onOpenCreate={() => setOpenCreate(true)} />
			</WrapperContainer>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<PopupCreateGateway onClose={() => setOpenCreate(false)} />
			</Popup>
			<Popup open={importExcel == 'open'} onClose={handleCloseImportExcel}>
				<ImportExcel
					name='file-gateway'
					file={file}
					pathTemplate='/static/files/Mau_Import_Gateway.xlsx'
					setFile={setFile}
					onClose={handleCloseImportExcel}
					onSubmit={handleImportExcel}
					setDataReadFile={setDataExcel}
				/>
			</Popup>
		</div>
	);
}

export default MainGateway;
