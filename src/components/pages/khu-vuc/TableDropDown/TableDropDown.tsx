import React, {useState} from 'react';

import {PropsTableDropDown} from './interfaces';
import styles from './TableDropDown.module.scss';
import clsx from 'clsx';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {ArrowDown2, Trash} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';

function TableDropDown({data, listLable, keyChild, keyUuid}: PropsTableDropDown) {
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				{listLable.map((v, i) =>
					i == 0 ? (
						<div key={i} style={{width: `${100 / listLable.length}%`, display: 'flex'}}>
							<div className={styles.arrow}></div>
							<div className={styles.order}>STT</div>
						</div>
					) : (
						<div key={i} style={{width: `${100 / listLable.length}%`}} className={styles.itemHead}>
							{v?.title}
						</div>
					)
				)}
			</div>
			<div className={styles.main}>
				{data?.map((v: any, i: number) => (
					<ItemDropDown
						key={i}
						objData={v}
						listLable={listLable}
						idx={i + 1}
						keyChild={keyChild}
						keyUuid={keyUuid}
						isChild={false}
					/>
				))}
			</div>
		</div>
	);
}

export default TableDropDown;

function ItemDropDown({objData, listLable, idx, keyChild, keyUuid, isChild}: any) {
	const [openChild, setOpenChild] = useState<boolean>(false);
	const [dataDelete, setDataDelete] = useState<any>(null);

	const handleDelete = () => {
		console.log(dataDelete);
	};

	return (
		<div className={styles.mainDropdown}>
			<div className={clsx(styles.itemDropDown, {[styles.isChild]: isChild})}>
				{listLable?.map((v: any, i: number) => {
					if (i == 0) {
						return (
							<div style={{width: `${100 / listLable.length}%`, display: 'flex'}} key={i} className={styles.item}>
								<div
									className={clsx(styles.arrow, {[styles.active]: openChild})}
									onClick={() => !isChild && setOpenChild(!openChild)}
								>
									{!isChild && <ArrowDown2 color='#2D74FF' size={18} />}
								</div>
								<div className={styles.order}>{idx}</div>
							</div>
						);
					} else if (i == listLable?.length - 1) {
						return (
							<div style={{width: `${100 / listLable.length}%`}} key={i} className={styles.item}>
								<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
									<IconCustom
										edit
										icon={<LuPencil fontSize={20} fontWeight={600} />}
										tooltip='Chỉnh sửa'
										color='#777E90'
									/>
									<IconCustom
										delete
										icon={<Trash size='22' />}
										tooltip='Xóa'
										color='#777E90'
										onClick={() => setDataDelete(objData)}
									/>
								</div>
							</div>
						);
					} else {
						return (
							<div style={{width: `${100 / listLable.length}%`}} key={i} className={styles.item}>
								{/* {listLable[i]?.key == 'sanLuongMT' ? 'a' : 'b'} */}
								{objData?.[listLable[i]?.key]}
							</div>
						);
					}
				})}
			</div>
			{openChild && (
				<div className={styles.mainChild}>
					{objData?.[keyChild.trim()]?.map((v: any, i: number) => (
						<ItemDropDown
							key={i}
							objData={v}
							listLable={listLable}
							idx={i + 1}
							keyChild={keyChild}
							keyUuid={keyUuid}
							isChild={true}
						/>
					))}
				</div>
			)}

			{/* POPUP */}
			<Dialog
				danger
				open={!!dataDelete}
				onClose={() => setDataDelete(null)}
				title='Xóa kho hàng'
				note='Bạn có chắc chắn muốn xóa kho hàng này!'
				onSubmit={handleDelete}
			/>
		</div>
	);
}
