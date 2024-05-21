export interface PropsImportExcel {
	name: string;
	file: any;
	setFile: (any: any) => void;
	onClose: () => void;
	onSubmit: () => void;
}
