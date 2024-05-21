import {IDevice} from '../../MainTransmitter/interfaces';

export interface PropsFormUpdateTransmitter {
	dataUpdate: IDevice | null;
	onClose: () => void;
}

export interface IFormUpdate {
	uuid: string;
	macNumber: string;
	name: string;
	gatewayUuid: string;
	teamUuid: string;
	status: number;
}
