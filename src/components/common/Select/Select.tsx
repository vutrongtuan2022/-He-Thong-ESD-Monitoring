import {createContext, useEffect, useRef, useState} from 'react';

import {PropsSelector} from './interfaces';
import clsx from 'clsx';
import styles from './Select.module.scss';
import {ArrowDown2} from 'iconsax-react';
import i18n from '~/locale/i18n';

export const ContextSelect = createContext<any>({});

function Select(props: PropsSelector) {
	const ref = useRef<any>(null);
	const [show, setShow] = useState<boolean>(false);
	const [value, setValue] = useState<any>(null);
	const [keyword, setKeyword] = useState<string>('');

	const handleChange = (data: any) => {
		const e = {
			target: {
				name: props?.name,
				textname: props?.textname,
				value: data?.value,
				title: data?.title,
			},
		};

		props.onChange && props.onChange(e);
		setValue(data);
	};

	useEffect(() => {
		const handleClick = (e: any) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setShow(false);
			}
		};
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [ref]);

	return (
		<ContextSelect.Provider
			value={{
				onChange: handleChange,
				data: value,
				defaultValue: props?.value,
				keyword,
			}}
		>
			<div className={styles.container}>
				{props?.label ? <label>{props.label}</label> : null}
				<div className={clsx(styles.select)} ref={ref}>
					<div
						className={clsx(styles.value, {[styles.active]: show, [styles.readOnly]: props.readOnly})}
						onClick={() => {
							if (props.readOnly) {
								return null;
							} else {
								setShow(!show);
							}
						}}
					>
						<p
							className={clsx(styles.text, {
								[styles.placeholder]: props.value == null || props.value == undefined,
							})}
						>
							{props.value != null && props.value != undefined ? value?.title : props.placeholder}
						</p>
						<span className={styles.icon}>
							<ArrowDown2 size={16} />
						</span>
					</div>
					<div
						className={clsx(styles.containerOption, {
							[styles.active]: show,
						})}
					>
						{props.isSearch ? (
							<div>
								<input
									className={styles.input_search}
									type='text'
									placeholder={i18n.t('Common.SearchPlaceholder')}
									onChange={(e) => setKeyword(e.target.value)}
									value={keyword}
									autoFocus={show}
								/>
							</div>
						) : null}
						<div className={clsx(styles.main)} onClick={() => setShow(false)}>
							{props.children}
						</div>
					</div>
				</div>
			</div>
		</ContextSelect.Provider>
	);
}

export default Select;
