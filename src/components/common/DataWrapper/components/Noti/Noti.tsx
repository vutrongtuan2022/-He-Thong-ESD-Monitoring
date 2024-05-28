import {PropsNoti} from './interfaces';
import styles from './Noti.module.scss';
import icons from '~/constants/images/icons';
import Button from '~/components/common/Button';
import ImageFill from '~/components/common/ImageFill';

function Noti({
	disableButton,
	img = icons.icon_table_empty,
	title = 'Dữ liệu trống',
	des = 'Hiện tại dữ liệu đang trống!',
	titleButton = ' Tạo ngay',
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
