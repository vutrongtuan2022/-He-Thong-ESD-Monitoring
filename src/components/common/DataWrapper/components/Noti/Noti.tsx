import {PropsNoti} from './interfaces';
import styles from './Noti.module.scss';
import icons from '~/constants/images/icons';
import Button from '~/components/common/Button';
import ImageFill from '~/components/common/ImageFill';
import i18n from '~/locale/i18n';

function Noti({
	disableButton,
	img = icons.icon_table_empty,
	title = i18n.t('Common.DataEmpty'),
	des = i18n.t('Common.NowDateEmpty'),
	titleButton = i18n.t('Common.CreateDay'),
	onClick = () => {},
}: PropsNoti) {
	return (
		<div className={styles.container}>
			<div className={styles.img}>
				<ImageFill className={styles.icon} src={img} />
			</div>
			{title && <h3>{title}</h3>}
			<p>{des}</p>
			{!disableButton ? (
				<div className={styles.btn}>
					<Button p_10_40 rounded_2 onClick={onClick}>
						{titleButton}
					</Button>
				</div>
			) : null}
		</div>
	);
}

export default Noti;
