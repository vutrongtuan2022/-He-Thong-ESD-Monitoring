import {PropsStateGateway} from './interfaces';
import {FaCheckCircle} from 'react-icons/fa';
import {FaCircleExclamation} from 'react-icons/fa6';
import styles from './StateGateway.module.scss';
import {STATE_GATEWAY} from '~/constants/config/enum';

function StateGateway({state = STATE_GATEWAY.HOAT_DONG}: PropsStateGateway) {
	const textColor = state == STATE_GATEWAY.HOAT_DONG ? styles.greenText : styles.redText;
	const Icon = state == STATE_GATEWAY.HOAT_DONG ? FaCheckCircle : FaCircleExclamation;

	return (
		<div className={`${styles.statusContainer} ${textColor}`}>
			<Icon />
			{state == STATE_GATEWAY.HOAT_DONG ? 'Hoạt động' : 'Không hoạt động'}
		</div>
	);
}

export default StateGateway;
