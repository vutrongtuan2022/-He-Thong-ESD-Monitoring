import {IGateway} from '../../ListTransmitterMainPage/interfaces';

export interface PropsPopupUpdate {
	onClose: () => void;
	dataUpdate: IGateway | null;
}
