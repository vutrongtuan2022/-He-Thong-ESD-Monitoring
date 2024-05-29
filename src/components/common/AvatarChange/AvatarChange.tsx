'use client';

import React, {useEffect, useState} from 'react';

import {PropsAvatarChange} from './interfaces';
import styles from './AvatarChange.module.scss';
import icons from '~/constants/images/icons';
import {MAXIMUM_FILE} from '~/constants/config';
import {toastError, toastWarn} from '~/common/funcs/toast';
import ImageFill from '../ImageFill';
import i18n from '~/locale/i18n';

function AvatarChange({path, name, onSetFile}: PropsAvatarChange) {
	const [imageBase64, setImageBase64] = useState<string>('');

	const handleSelectImg = (e: any) => {
		const file = e?.target?.files[0];

		if (file) {
			const {size, type} = e.target.files[0];
			const maxSize = MAXIMUM_FILE; //MB

			if (size / 1000000 > maxSize) {
				toastError({msg: `${i18n.t('Common.kichthuoctoidacuaanh')} ${maxSize} mb`});
				return;
			} else if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png') {
				toastWarn({
					msg: i18n.t('Common.dinhdangkhongchixac'),
				});
				return;
			}

			const imageUrl = URL.createObjectURL(file);
			setImageBase64((prev: any) => {
				URL.revokeObjectURL(prev);
				return imageUrl;
			});
			onSetFile && onSetFile(file);
		}
	};

	useEffect(() => {
		return () => {
			if (imageBase64) {
				URL.revokeObjectURL(imageBase64);
			}
		};
	}, [imageBase64]);

	return (
		<div className={styles.container}>
			<ImageFill
				src={!!imageBase64 ? imageBase64 : `${process.env.NEXT_PUBLIC_AVATAR}/${path}`}
				alt='file base64'
				className={styles.image}
			/>
			<div className={styles.main_des}>
				<p>{i18n.t('Common.hinhanhtailendatkichthuoctoida')}</p>
				<span>{i18n.t('Common.dinhdanghotro')}</span>
				<label className={styles.input}>
					<input hidden type='file' name={name} onChange={handleSelectImg} onClick={(e: any) => (e.target.value = null)} />
					<ImageFill src={icons.iconUpload} className={styles.upload} />
					<h5>{i18n.t('Common.chonanh')}</h5>
				</label>
			</div>
		</div>
	);
}

export default AvatarChange;
