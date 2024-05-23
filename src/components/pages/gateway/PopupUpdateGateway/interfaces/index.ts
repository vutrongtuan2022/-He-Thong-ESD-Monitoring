import {IGateway} from '../../ListGateway/interfaces';

export interface PropsPopupUpdateGateway {
	onClose: () => void;
	dataUpdate: IGateway | null;
}
