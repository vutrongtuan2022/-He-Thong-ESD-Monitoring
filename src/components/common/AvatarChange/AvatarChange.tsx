'use client';

import React, {useEffect, useState} from 'react';

import {PropsAvatarChange} from './interfaces';
import styles from './AvatarChange.module.scss';
import icons from '~/constants/images/icons';
import {MAXIMUM_FILE} from '~/constants/config';
import {toastError, toastWarn} from '~/common/funcs/toast';
import ImageFill from '../ImageFill';

function AvatarChange({path, name}: PropsAvatarChange) {
	const [imageBase64, setImageBase64] = useState<string>('');

	const handleSelectImg = (e: any) => {
		const file = e?.target?.files[0];

		if (file) {
			const {size, type} = e.target.files[0];
			const maxSize = MAXIMUM_FILE; //MB

			if (size / 1000000 > maxSize) {
				toastError({msg: `Kích thước tối đa của ảnh là ${maxSize} mb`});
				return;
			} else if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png') {
				toastWarn({
					msg: `Định dạng tệp không chính xác, đuôi tệp chấp nhận .jpg, .jpeg, .png`,
				});
				return;
			}

			const imageUrl = URL.createObjectURL(file);
			setImageBase64((prev: any) => {
				URL.revokeObjectURL(prev);
				return imageUrl;
			});
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
				src={!!imageBase64 ? imageBase64 : process.env.NEXT_PUBLIC_IMAGE + path}
				alt='file base64'
				className={styles.image}
			/>
			<div className={styles.main_des}>
				<p>Hình ảnh tải lên đạt kích thước tối thiểu 300pixel x 300pixel</p>
				<span>Định dạng hỗ trợ: JPG, JPEG, PNG</span>
				<label className={styles.input}>
					<input hidden type='file' name={name} onChange={handleSelectImg} onClick={(e: any) => (e.target.value = null)} />
					<ImageFill src={icons.iconUpload} className={styles.upload} />
					<h5>Chọn ảnh</h5>
				</label>
			</div>
		</div>
	);
}

export default AvatarChange;
