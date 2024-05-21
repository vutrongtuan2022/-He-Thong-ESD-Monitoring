import clsx from 'clsx';
// import * as XLSX from 'xlsx';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React, {Fragment, useState} from 'react';

import icons from '~/constants/images/icons';
import Popup from '~/components/common/Popup';
import Button from '~/components/common/Button';
// import {toastError, toastWarn} from '~/common/func/toast';

import styles from './ImportExcel.module.scss';
import {PropsImportExcel, Template} from './interfaces';
// import {convertFileSize} from '~/common/func/optionConvert';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
// import colorSevices from '~/services/colorServices';
// import useQueryParams from '~/common/hooks/useQueryParams';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import background from '~/constants/images/background';

function ImportExcel({}: PropsImportExcel) {
	const router = useRouter();

	const queryClient = useQueryClient();
	// const {page, keyword, pageSize} = useQueryParams();

	const {importExcel, ...rest} = router.query;

	const [dragging, setDragging] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<any>(null);
	const [listData, setListData] = useState<any[]>([]);

	const handleClose = () => {
		setSelectedFile(null);
		router.replace(
			{
				query: rest,
			},
			undefined,
			{scroll: false}
		);
	};

	const handleDragEnter = (e: any) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		convertData(file);
	};

	const handleFileChange = (e: any) => {
		const file = e.target.files[0];
		convertData(file);
	};

	async function convertData(file: any) {
		// try {
		// 	const reader = new FileReader();
		// 	reader.onload = (evt: any) => {
		// 		const bstr = evt.target.result;
		// 		const wb = XLSX.read(bstr, {type: 'binary'});
		// 		const wsname = wb.SheetNames[0];
		// 		const ws = wb.Sheets[wsname];
		// 		const data: Template[] = XLSX.utils.sheet_to_json(ws);
		// 		const convert = data.map((v: Template) => ({
		// 			code: v['MaDat'],
		// 			description: v['MoTa'],
		// 			red: v['Red'],
		// 			green: v['Green'],
		// 			blue: v['Blue'],
		// 		}));
		// 		if (convert.length > 0) {
		// 			setListData(convert);
		// 			setSelectedFile(file);
		// 		} else {
		// 			return toastWarn({msg: 'Không có dữ liệu trong file đầu vào'});
		// 		}
		// 	};
		// 	reader.readAsBinaryString(file);
		// } catch (err) {
		// 	return toastError({
		// 		msg: 'Không nạp được dữ liệu, vui lòng kiểm tra file đầu vào',
		// 	});
		// }
	}

	// const createManyColor = useMutation({
	// 	mutationFn: () =>
	// 		httpRequest({
	// 			showMessageFailed: true,
	// 			showMessageSuccess: true,
	// 			http: colorSevices.createManyColor({data: listData}),
	// 		}),
	// 	onSuccess: (data) => {
	// 		if (data) {
	// 			queryClient.invalidateQueries([QUERY_KEY.ma_mau, page, pageSize, keyword]);
	// 			setSelectedFile(null);
	// 			router.replace(
	// 				{
	// 					query: rest,
	// 				},
	// 				undefined,
	// 				{scroll: false}
	// 			);
	// 		}
	// 	},
	// });

	const handleSubmit = () => {
		// createManyColor.mutate();
	};

	return (
		<Fragment>
			{/* <Loading loading={createManyColor.isLoading} /> */}
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>Nhập file từ Excel</h2>
					<p className={styles.note}>Bạn có thể tải tệp .xls, .xlsx, .csv lên bản của mình</p>
					<p className={styles.download}>
						<a download href='/static/files/Mau_Import_Device.xlsx' style={{color: '#2A85FF'}}>
							Tải xuống{' '}
						</a>
						Tệp tài liệu mẫu
					</p>
				</div>
				<div className={styles.main}>
					{selectedFile && listData?.length > 0 ? (
						<div className={styles.selectedFile}>
							<div className={styles.file}>
								<div className={styles.icon}>
									<i>
										<Image src={icons.XSL} width={36} height={36} alt='icon xsl' />
									</i>
								</div>
								<div className={styles.info}>
									<p className={styles.name}>{selectedFile?.name}</p>
									{/* <p className={styles.size}>{convertFileSize(selectedFile?.size / 1000)}</p> */}
								</div>
								<label htmlFor='file-work' className={styles.change}>
									<input
										hidden
										id='file-work'
										type='file'
										accept='.xls, .xlsx, .csv'
										onClick={(e: any) => {
											e.target.value = null;
										}}
										onChange={handleFileChange}
									/>
									Thay thế
								</label>
							</div>
						</div>
					) : (
						<label
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleDrop}
							className={clsx(styles.inputFile, {
								[styles.dragging]: dragging,
							})}
							htmlFor='file-work'
						>
							<div className={styles.groupEmpty}>
								<div className={styles.imageEmpty}>
									<Image alt='Image ' width={200} height={150} className={styles.image} src={background.emptyFile} />
								</div>
								<p>Kéo và thả tệp của bạn vào đây hoặc</p>
								<p>Tải lên</p>
							</div>
							<input
								hidden
								id='file-work'
								type='file'
								accept='.xls, .xlsx, .csv'
								onChange={handleFileChange}
								onClick={(e: any) => {
									e.target.value = null;
								}}
							/>
						</label>
					)}
				</div>
				<div className={styles.groupBtn}>
					<Button p_8_40 maxContent div bold primary disable={!selectedFile} rounded_6 onClick={handleSubmit}>
						Tải lên
					</Button>
					<Button p_8_40 maxContent bold grey_2 rounded_6 div onClick={handleClose}>
						Đóng
					</Button>
				</div>
			</div>
		</Fragment>
	);
}

export default ImportExcel;
