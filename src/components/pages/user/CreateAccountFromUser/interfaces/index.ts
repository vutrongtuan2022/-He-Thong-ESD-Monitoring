import {IUser} from '../../MainPageUser/interfaces';

export interface PropsCreateAccountFromUser {
	onClose: () => void;
	dataCreateAccount: IUser | null;
}
