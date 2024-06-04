import {useState} from 'react';

import {PropsSearchInput} from './interfaces';
import {GrSearch} from 'react-icons/gr';
import clsx from 'clsx';
import styles from './SearchInput.module.scss';
import i18n from '~/locale/i18n';

function SearchInput({keyword, setKeyword, placeholder = i18n.t('Common.Search')}: PropsSearchInput) {
	const [isFocus, setIsfocus] = useState<boolean>(false);

	return (
		<div className={clsx(styles.container, {[styles.focus]: isFocus})}>
			<div className={styles.icon}>
				<GrSearch color='#23262f' size={20} />
			</div>
			<input
				type='text'
				value={keyword}
				placeholder={placeholder}
				onFocus={() => setIsfocus(true)}
				onBlur={() => setIsfocus(false)}
				onChange={(e: any) => setKeyword(e.target.value)}
			/>
		</div>
	);
}

export default SearchInput;
