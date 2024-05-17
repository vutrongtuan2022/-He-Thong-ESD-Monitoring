import {PropsStatus} from './interfaces';
import {FaCheckCircle} from 'react-icons/fa';
import {FaCircleExclamation} from 'react-icons/fa6';
import styles from './Status.module.scss';

function Status({status}: PropsStatus) {
	const textColor = status === 'Online' ? styles.greenText : styles.redText;
	const Icon = status === 'Online' ? FaCheckCircle : FaCircleExclamation;

	return (
		<div className={`${styles.statusContainer} ${textColor}`}>
			<Icon />
			{status === 'Online' ? 'Online' : 'Offline'}
		</div>
	);
}

export default Status;
