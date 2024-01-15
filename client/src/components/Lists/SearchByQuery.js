/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { txnListType } from '../types';
import {
	IconButton,
	TextField,
	Select,
	MenuItem,
	InputAdornment,
	makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import TransactionView from '../View/TransactionView';
import BlockView from '../View/BlockView';

const useStyles = makeStyles(theme => ({
	searchField: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& .MuiOutlinedInput-input': {
			padding: '16px 8px'
		}
	},
	searchInput: {
		marginRight: theme.spacing(0),
		'& > div': {
			paddingRight: '24px !important',
			borderRadius: '25px'
		}
	},
	selectInput: {
		'& .MuiSelect-select:focus': {
			backgroundColor: 'transparent'
		},
		borderRight: '1px solid rgba(0,0,0,0.2)'
	},
	iconButton: {
		height: 40,
		width: 40,
		color: '#21295c',
		backgroundColor: '#b9d6e1',
		borderRadius: 15
	}
}));

const SearchByQuery = props => {
	let { txnList } = props;
	let { blockSearch } = props;
	const classes = useStyles();
	const options = ['交易哈希', '区块序号'];
	const [search, setSearch] = useState('');
	const [selectedOption, setSelectedOption] = useState('交易哈希');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [error, setError] = useState('');
	const [searchClick, setSearchClick] = useState(false);

	useEffect(() => {
		if (searchClick) {
			setError(props.searchError);
			if (!props.searchError) handleDialogOpen();
			setSearchClick(false);
		}
	}, [searchClick]);

	const searchData = async () => {
		if (selectedOption === '交易哈希') {
			await props.getTxnList(props.currentChannel, search);
		} else if (selectedOption === '区块序号') {
			await props.getBlockSearch(props.currentChannel, search);
		}
		setSearchClick(true);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (
			!search ||
			(selectedOption === '区块序号' && (isNaN(search) || search.length > 9))
		) {
			setError('请输入合法的交易哈希/区块序号');
			return;
		}
		searchData();
	};

	const handleDialogOpen = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	return (
		<div
			className={classes.searchField}
			style={{ marginBottom: !error ? '23px' : '0px' }}
		>
			<TextField
				value={search}
				onChange={e => {
					setSearch(e.target.value);
					if (error) {
						setDialogOpen(false);
						setError('');
					}
				}}
				onKeyPress={e => e.key === 'Enter' && handleSubmit(e)}
				label=" 根据 交易哈希 / 区块序号 搜索"
				variant="outlined"
				fullWidth
				error={error}
				helperText={error}
				className={classes.searchInput}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Select
								value={selectedOption}
								className={classes.selectInput}
								onChange={e => {
									setSelectedOption(e.target.value);
									if (error) {
										setDialogOpen(false);
										setError('');
									}
								}}
								disableUnderline
								MenuProps={{
									anchorOrigin: {
										vertical: 'bottom',
										horizontal: 'left'
									},
									getContentAnchorEl: null
								}}
							>
								{options.map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleSubmit} className={classes.iconButton}>
								<SearchIcon />
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
			<Dialog
				open={dialogOpen && !error}
				onClose={handleDialogClose}
				fullWidth
				maxWidth="md"
			>
				{!error && selectedOption === 'Block No' ? (
					<BlockView blockHash={blockSearch} onClose={handleDialogClose} />
				) : (
					<TransactionView transaction={txnList} onClose={handleDialogClose} />
				)}
			</Dialog>
		</div>
	);
};
SearchByQuery.propTypes = {
	txnList: txnListType.isRequired
};

export default withRouter(SearchByQuery);
