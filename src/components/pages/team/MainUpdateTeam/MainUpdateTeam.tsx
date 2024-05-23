import React, {Fragment, useState} from 'react';

import {PropsMainUpdateTeam} from './interfaces';
import styles from './MainUpdateTeam.module.scss';
import Breadcrumb from '~/components/common/Breadcrumb';
import {PATH} from '~/constants/config';
import {BsThreeDots} from 'react-icons/bs';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import Button from '~/components/common/Button';
import Form, {Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import TextArea from '~/components/common/Form/components/TextArea';
import teamServices from '~/services/teamServices';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import {useRouter} from 'next/router';
import {IDataDetailTeam} from '../MainDetailTeam/interfaces';

interface IFrom {
	name: string;
	code: string;
	leaderUuid: string;
	areaUuid: string;
	parentUuid: string;
	note: string;
}

function MainUpdateTeam({}: PropsMainUpdateTeam) {
	const router = useRouter();

	const {_id} = router.query;

	const [dataDetail, setDataDetail] = useState<IDataDetailTeam>();
	const [form, setForm] = useState<IFrom>({
		name: '',
		code: '',
		leaderUuid: '',
		areaUuid: '',
		parentUuid: '',
		note: '',
	});

	// GET DETAIL TEAM
	useQuery([QUERY_KEY.chi_tiet_team, _id], {
		queryFn: () =>
			httpRequest({
				http: teamServices.detailTeam({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataDetail(data);
				setForm({
					name: data.name,
					code: data.code,
					leaderUuid: data.leaderUuid,
					areaUuid: data.areaUuid,
					note: data.notes,
					parentUuid: data?.parentUuid,
				});
			}
		},
		enabled: !!_id,
	});

	// GET LIST DROPDOWN
	const listAreas = useQuery([QUERY_KEY.dropdown_danh_sach_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listArea({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUsers = useQuery([QUERY_KEY.dropdown_danh_sach_nguoi_dung], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listUser({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listTeams = useQuery([QUERY_KEY.dropdown_danh_sach_team], {
		queryFn: () =>
			httpRequest({
				http: categoryServices.listTeam({
					keyword: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	// API
	const upsertTeam = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa team thành công!',
				http: teamServices.upsertTeam({
					uuid: _id as string,
					name: form.name,
					code: form.code,
					leaderUuid: form.leaderUuid,
					areaUuid: form.areaUuid,
					parentUuid: form.parentUuid,
					notes: form.note,
					status: dataDetail?.status!,
					rootUuid: null,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					code: '',
					leaderUuid: '',
					areaUuid: '',
					parentUuid: '',
					note: '',
				});
				router.replace(PATH.Team, undefined, {
					scroll: false,
					shallow: false,
				});
			}
		},
	});

	// SUBMIT
	const handleSubmit = async () => {
		if (!_id) {
			return toastWarn({msg: 'Không tìm thấy team!'});
		}
		if (!form.name) {
			return toastWarn({msg: 'Vui lòng nhập tên team!'});
		}
		if (!form.code) {
			return toastWarn({msg: 'Vui lòng nhập mã team!'});
		}
		if (!form.leaderUuid) {
			return toastWarn({msg: 'Vui lòng chọn người quản lý!'});
		}
		if (!form.areaUuid) {
			return toastWarn({msg: 'Vui lòng nhập khu vực quản lý!'});
		}

		return upsertTeam.mutate();
	};

	return (
		<Fragment>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: 'Trang chủ',
					},
					{
						path: PATH.Team,
						title: 'Danh sách team',
					},
					{
						path: '',
						title: 'Chỉnh sửa team',
					},
				]}
				action={
					<div className={styles.main_action}>
						<div className={styles.box_icon}>
							<BsThreeDots className={styles.dots} color='#23262f' size={20} />
						</div>
					</div>
				}
			/>
			<WrapperContainer>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.left}>
							<h4>Chỉnh sửa team</h4>
							<p>Điền đầy đủ các thông tin team</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.Team} p_10_24 rounded_2 grey_outline>
								Hủy bỏ
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								Cập nhật
							</Button>
						</div>
					</div>
					<Loading loading={upsertTeam.isLoading} />
					<div className={styles.form}>
						<Form form={form} setForm={setForm}>
							<Input
								name='name'
								value={form.name || ''}
								type='text'
								label={
									<span>
										Tên team <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tên team'
							/>

							<div className={clsx('mt', 'col_2')}>
								<Input
									name='code'
									value={form.code || ''}
									type='text'
									label={
										<span>
											Mã team <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder='Nhập mã team'
								/>
								<Select
									isSearch
									name='leaderUuid'
									placeholder='Người quản lý'
									value={form?.leaderUuid || null}
									onChange={(e: any) =>
										setForm((prev: any) => ({
											...prev,
											leaderUuid: e.target.value,
										}))
									}
									label={
										<span>
											Người quản lý<span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listUsers.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
							</div>

							<div className={clsx('mt', 'col_2')}>
								<div>
									<Select
										isSearch
										name='parentUuid'
										placeholder='Team cấp trên'
										value={form?.parentUuid || null}
										onChange={(e: any) =>
											setForm((prev: any) => ({
												...prev,
												parentUuid: e.target.value,
											}))
										}
										label={<span>Team cấp trên</span>}
									>
										{listTeams.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
										))}
									</Select>
								</div>
								<Select
									isSearch
									name='areaUuid'
									placeholder='Chọn khu vực quản lý'
									value={form?.areaUuid || null}
									onChange={(e: any) =>
										setForm((prev: any) => ({
											...prev,
											areaUuid: e.target.value,
										}))
									}
									label={
										<span>
											Khu vực <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listAreas.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
							</div>
							<div className={clsx('mt')}>
								<TextArea name='note' value={form.note} placeholder='Nhập mô tả' label={<span>Mô tả</span>} />
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</Fragment>
	);
}

export default MainUpdateTeam;
