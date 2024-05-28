import {PropsAvatar} from './interfaces';
import clsx from 'clsx';
import imageConfig from '~/constants/images/config';
import styles from './Avatar.module.scss';
import ImageWithFallback from '../Image/ImageWithFallback';

function Avatar({src, className}: PropsAvatar) {
	return (
		<div className={clsx(styles.container, className)}>
			<ImageWithFallback className={styles.avatar} layout='fill' alt='avatar' src={src || imageConfig.placeholder} priority />
		</div>
	);
}

export default Avatar;
