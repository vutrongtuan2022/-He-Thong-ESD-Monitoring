import {IDevice} from '../../MainDevice/interfaces';

export interface PropsFormUpdateDevice {
	dataUpdate: IDevice | null;
	onClose: () => void;
}

export interface IFormUpdate {
	uuid: string;
	macNumber: string;
	name: string;
	teamUuid: string;
}
