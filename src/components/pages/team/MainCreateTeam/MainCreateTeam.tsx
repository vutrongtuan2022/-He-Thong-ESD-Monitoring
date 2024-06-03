import React, {Fragment, useState} from 'react';

import {PropsMainCreateTeam} from './interfaces';
import styles from './MainCreateTeam.module.scss';
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
import {QUERY_KEY, STATUS_GENERAL} from '~/constants/config/enum';
import categoryServices from '~/services/categoryServices';
import Loading from '~/components/common/Loading';
import {toastWarn} from '~/common/funcs/toast';
import {useRouter} from 'next/router';
import i18n from '~/locale/i18n';

interface IFrom {
	name: string;
	code: string;
	leaderUuid: string;
	areaUuid: string;
	parentUuid: string;
	note: string;
}

function MainCreateTeam({}: PropsMainCreateTeam) {
	const router = useRouter();

	const [form, setForm] = useState<IFrom>({
		name: '',
		code: '',
		leaderUuid: '',
		areaUuid: '',
		parentUuid: '',
		note: '',
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

	// API upsertTeam
	const upsertTeam = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: i18n.t('Team.AddNewTeamSuccessfully'),
				http: teamServices.upsertTeam({
					uuid: '',
					name: form.name,
					code: form.code,
					leaderUuid: form.leaderUuid,
					areaUuid: form.areaUuid,
					parentUuid: form.parentUuid,
					notes: form.note,
					status: STATUS_GENERAL.SU_DUNG,
					rootUuid: '',
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
		if (!form.name) {
			return toastWarn({msg: i18n.t('Team.PleaseEnterTeamName')});
		}
		if (!form.code) {
			return toastWarn({msg: i18n.t('Team.PleaseEnterTeamID')});
		}
		if (!form.leaderUuid) {
			return toastWarn({msg: i18n.t('Team.PleaseChooseManager')});
		}
		if (!form.areaUuid) {
			return toastWarn({msg: i18n.t('Team.PleaseEnterArea')});
		}

		return upsertTeam.mutate();
	};

	return (
		<Fragment>
			<Breadcrumb
				listUrls={[
					{
						path: PATH.Home,
						title: i18n.t('Common.Home'),
					},
					{
						path: PATH.Team,
						title: i18n.t('Team.ListTeam'),
					},
					{
						path: '',
						title: i18n.t('Team.AddNewTeam'),
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
							<h4>{i18n.t('Team.AddNewTeam')}</h4>
							<p>{i18n.t('Team.EnterFullInformation')}</p>
						</div>
						<div className={styles.right}>
							<Button href={PATH.Team} p_10_24 rounded_2 grey_outline>
								{i18n.t('Common.Cancel')}
							</Button>
							<Button p_10_24 rounded_2 primary onClick={handleSubmit}>
								{i18n.t('Common.Save')}
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
										{i18n.t('Team.TeamName')} <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder={i18n.t('Team.EnterTeamName')}
							/>

							<div className={clsx('mt', 'col_2')}>
								<Input
									name='code'
									value={form.code || ''}
									type='text'
									label={
										<span>
											{i18n.t('Team.IDTeam')} <span style={{color: 'red'}}>*</span>
										</span>
									}
									placeholder={i18n.t('Team.EnterTeamID')}
								/>
								<Select
									isSearch
									name='leaderUuid'
									placeholder={i18n.t('Team.TeamManager')}
									value={form?.leaderUuid || null}
									onChange={(e: any) =>
										setForm((prev: any) => ({
											...prev,
											leaderUuid: e.target.value,
										}))
									}
									label={
										<span>
											{i18n.t('Team.TeamManager')}
											<span style={{color: 'red'}}>*</span>
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
										placeholder={i18n.t('Team.NameofSuperior')}
										value={form?.parentUuid || null}
										onChange={(e: any) =>
											setForm((prev: any) => ({
												...prev,
												parentUuid: e.target.value,
											}))
										}
										label={<span>{i18n.t('Team.NameofSuperior')}</span>}
									>
										{listTeams.data?.map((v: any) => (
											<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
										))}
									</Select>
								</div>
								<Select
									isSearch
									name='areaUuid'
									placeholder={i18n.t('Team.ChooseManagementArea')}
									value={form?.areaUuid || null}
									onChange={(e: any) =>
										setForm((prev: any) => ({
											...prev,
											areaUuid: e.target.value,
										}))
									}
									label={
										<span>
											{i18n.t('Common.Area')} <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listAreas.data?.map((v: any) => (
										<Option key={v?.uuid} title={v?.name} value={v?.uuid} />
									))}
								</Select>
							</div>
							<div className={clsx('mt')}>
								<TextArea
									name='note'
									value={form.note}
									placeholder={i18n.t('Common.EnterDescription')}
									label={<span>{i18n.t('Common.Description')}</span>}
								/>
							</div>
						</Form>
					</div>
				</div>
			</WrapperContainer>
		</Fragment>
	);
}

export default MainCreateTeam;
