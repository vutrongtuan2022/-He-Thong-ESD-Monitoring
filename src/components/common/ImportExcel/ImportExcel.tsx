import clsx from 'clsx';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import React, {Fragment, useState} from 'react';

import icons from '~/constants/images/icons';
import Button from '~/components/common/Button';

import styles from './ImportExcel.module.scss';
import {PropsImportExcel} from './interfaces';
import {convertFileSize} from '~/common/funcs/optionConvert';
import background from '~/constants/images/background';
import {toastError, toastWarn} from '~/common/funcs/toast';
import i18n from '~/locale/i18n';

function ImportExcel({name, file, pathTemplate, setDataReadFile, setFile, onClose, onSubmit}: PropsImportExcel) {
	const [dragging, setDragging] = useState<boolean>(false);

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
		try {
			const reader = new FileReader();
			reader.onload = (evt: any) => {
				const bstr = evt.target.result;
				const wb = XLSX.read(bstr, {type: 'binary'});
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				const data: any[] = XLSX.utils.sheet_to_json(ws);

				if (data.length > 0) {
					setDataReadFile && setDataReadFile(data);
					setFile(file);
				} else {
					return toastWarn({msg: i18n.t('Common.NoDataFileInput')});
				}
			};
			reader.readAsBinaryString(file);
		} catch (err) {
			return toastError({
				msg: i18n.t('Common.ImportError'),
			});
		}
	}

	return (
		<Fragment>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>{i18n.t('Common.ImportFileFromExcel')}</h2>
					<p className={styles.note}>{i18n.t('Common.CanInputFile')}</p>
					<p className={styles.download}>
						<a download href={pathTemplate} style={{color: '#2A85FF'}}>
							{i18n.t('Common.Download')}
						</a>
						{i18n.t('Common.FileBase')}
					</p>
				</div>
				<div className={styles.main}>
					{file ? (
						<div className={styles.selectedFile}>
							<div className={styles.file}>
								<div className={styles.icon}>
									<i>
										<Image src={icons.XSL} width={36} height={36} alt='icon xsl' />
									</i>
								</div>
								<div className={styles.info}>
									<p className={styles.name}>{file?.name}</p>
									<p className={styles.size}>{convertFileSize(file?.size / 1000)}</p>
								</div>
								<div>
									<label htmlFor={`file-work-${name}`} className={styles.change}>
										<input
											hidden
											id={`file-work-${name}`}
											type='file'
											accept='.xls, .xlsx, .csv'
											onClick={(e: any) => {
												e.target.value = null;
											}}
											onChange={handleFileChange}
										/>
										{i18n.t('Common.Replace')}
									</label>
									<div className={styles.clear} onClick={() => setFile(null)}>
										{i18n.t('Common.Delete')}
									</div>
								</div>
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
							htmlFor={`file-work-${name}`}
						>
							<div className={styles.groupEmpty}>
								<div className={styles.imageEmpty}>
									<Image alt='Image ' width={200} height={150} className={styles.image} src={background.emptyFile} />
								</div>
								<p>{i18n.t('Common.DragAndDropFile')}</p>
								<p>{i18n.t('Common.Upload')}</p>
							</div>
							<input
								hidden
								id={`file-work-${name}`}
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
					<Button p_8_40 maxContent bold grey_2 rounded_6 div onClick={onClose}>
						{i18n.t('Common.Close')}
					</Button>
					<Button p_8_40 maxContent div bold primary disable={!file} rounded_6 onClick={onSubmit}>
						{i18n.t('Common.Options')}
					</Button>
				</div>
			</div>
		</Fragment>
	);
}

export default ImportExcel;
