import {IUser} from '../../MainPageUser/interfaces';

export interface PropsPopupCreateAccount {
	onClose: () => void;
	dataCreateAccount: IUser | null;
}
