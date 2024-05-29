export interface PropsListDeviceNG {}

export interface IDeviceDashboard {
	deviceUuid: string;
	macNumber: string;
	edsStatic: number;
	timeNgStart: string;
	totalNgMinutes: number;
	teamUuid: string | null;
	teamName: string | null;
	teamCode: string | null;
	qaUserUuid: null;
}
