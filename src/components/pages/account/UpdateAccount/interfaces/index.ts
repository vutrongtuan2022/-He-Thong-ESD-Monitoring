import {IAccount} from '../../MainPageAccount/interfaces';

export interface PropsUpdateAccount {
	onClose: () => void;
	dataUpdateAccount: IAccount | null;
}
