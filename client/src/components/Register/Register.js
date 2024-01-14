/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { shape, string } from 'prop-types';
import Container from '../Container';

import { authSelectors, authOperations } from '../../state/redux/auth';

const styles = theme => ({
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
			.spacing.unit * 3}px`
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit
	},
	title: {
		marginTop: theme.spacing.unit * 2
	},
	actions: {
		marginTop: theme.spacing.unit * 3
	},
	errortext: {
		fontSize: 16,
		font: 'bold',
		color: 'red'
	},
	successtext: {
		fontSize: 16,
		font: 'bold',
		color: 'green'
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing.unit,
		top: 0,
		color: theme.palette.grey[500]
	}
});

export class Register extends Component {
	static propTypes = {
		classes: shape({
			form: string,
			container: string,
			paper: string,
			actions: string
		}).isRequired
	};

	constructor(props) {
		super(props);
		const { registered } = props;
		this.state = {
			info: null,
			user: {
				error: null,
				value: ''
			},
			firstname: {
				error: null,
				value: ''
			},
			lastname: {
				error: null,
				value: ''
			},
			email: {
				error: null,
				value: ''
			},
			password: {
				error: null,
				value: ''
			},
			password2: {
				error: null,
				value: ''
			},
			roles: {
				error: null,
				value: ''
			},
			rolesList: ['admin', 'user'],
			error: '',
			registered,
			isLoading: false,
			allValid: false,
			lastSaved: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const { registered = [], error } = nextProps;
		this.setState(() => ({
			registered,
			error
		}));
	}

	handleChange = event => {
		const { target } = event;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;
		this.setState({
			[name]: { value }
		});

		let password2 = {};
		if (name === 'password') {
			if (
				this.state.password2.value.length &&
				value !== this.state.password2.value
			) {
				password2 = {
					value: this.state.password2.value,
					error: 'The password confirmation does not match.'
				};
			} else {
				password2 = { value: this.state.password2.value, error: null };
			}
		} else if (name === 'password2') {
			if (
				this.state.password.value.length &&
				value !== this.state.password.value
			) {
				password2 = { value, error: 'The password confirmation does not match.' };
			} else {
				password2 = { value, error: null };
			}
		} else {
			password2 = this.state.password2;
		}

		this.setState({ password2 }, () => {
			if (
				this.state.user.value &&
				this.state.password.value &&
				this.state.password2.value &&
				this.state.roles.value &&
				!this.state.password2.error
			) {
				this.setState({ allValid: true });
			} else if (this.state.allValid) {
				this.setState({ allValid: false });
			}
		});
	};

	submitForm = async e => {
		e.preventDefault();

		const { register, userlist } = this.props;
		const {
			user,
			password,
			password2,
			roles,
			firstname,
			lastname,
			email
		} = this.state;

		const userInfo = {
			user: user.value,
			password: password.value,
			password2: password2.value,
			roles: roles.value,
			firstname: firstname.value,
			lastname: lastname.value,
			email: email.value
		};

		const info = await register(userInfo);
		await userlist();
		this.setState(() => ({ info }));
		this.setState(() => ({ lastSaved: user.value }));
		this.resetForm();
		return true;
	};
	resetForm() {
		const user = {
			error: null,
			value: ''
		};
		const firstname = {
			error: null,
			value: ''
		};
		const lastname = {
			error: null,
			value: ''
		};
		const email = {
			error: null,
			value: ''
		};
		const password = {
			error: null,
			value: ''
		};
		const password2 = {
			error: null,
			value: ''
		};
		const roles = {
			error: null,
			value: ''
		};
		this.setState({
			user: user,
			firstname: firstname,
			lastname: lastname,
			email: email,
			password: password,
			password2: password2,
			roles: roles
		});
	}

	render() {
		const {
			info,
			user,
			password,
			password2,
			roles,
			firstname,
			lastname,
			email,
			rolesList,
			isLoading,
			lastSaved
		} = this.state;
		const { classes, error, onClose } = this.props;
		return (
			<Container>
				<Paper className={classes.paper}>
					<Typography className={classes.title} component="h5" variant="headline">
						注册用户
					</Typography>
					<MuiDialogTitle>
						{onClose ? (
							<IconButton
								aria-label="Close"
								className={classes.closeButton}
								onClick={onClose}
							>
								<CloseIcon />
							</IconButton>
						) : null}
					</MuiDialogTitle>
					<form className={classes.form} onSubmit={this.submitForm}>
						<FormControl margin="dense" required fullWidth>
							<TextField
								required
								fullWidth
								id="user"
								name="user"
								label="用户"
								disabled={isLoading}
								value={user.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{user.error && (
								<FormHelperText id="component-error-text" error>
									{user.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								fullWidth
								id="firstname"
								name="firstname"
								label="名字"
								disabled={isLoading}
								value={firstname.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{firstname.error && (
								<FormHelperText id="component-error-text" error>
									{firstname.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								fullWidth
								id="lastname"
								name="lastname"
								label="姓氏"
								disabled={isLoading}
								value={lastname.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{lastname.error && (
								<FormHelperText id="component-error-text" error>
									{lastname.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								fullWidth
								id="email"
								name="email"
								label="邮箱地址"
								disabled={isLoading}
								value={email.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{email.error && (
								<FormHelperText id="component-error-text" error>
									{email.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								required
								fullWidth
								error={!!password.error}
								id="password"
								type="password"
								name="password"
								label="密码"
								disabled={isLoading}
								value={password.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{password.error && (
								<FormHelperText id="component-error-text" error>
									{password.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								error={!!password2.error}
								required
								fullWidth
								id="password2"
								type="password"
								name="password2"
								label="密码(确认)"
								disabled={isLoading}
								value={password2.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							/>
							{password2.error && (
								<FormHelperText id="component-error-text" error>
									{password2.error}
								</FormHelperText>
							)}
						</FormControl>
						<FormControl margin="dense" required fullWidth>
							<TextField
								required
								fullWidth
								select
								error={!!roles.error}
								id="roles"
								type="roles"
								name="roles"
								label="角色"
								disabled={isLoading}
								value={roles.value}
								onChange={e => this.handleChange(e)}
								margin="dense"
							>
								{rolesList.map(item => (
									<MenuItem key={item} value={item}>
										{item}
									</MenuItem>
								))}
							</TextField>
							{roles.error && (
								<FormHelperText id="component-error-text" error>
									{roles.error}
								</FormHelperText>
							)}
						</FormControl>
						{error && (
							<FormHelperText id="component-error-text" error>
								{error}
							</FormHelperText>
						)}
						{info && lastSaved && (
							<FormHelperText
								id="component-error-text"
								className={
									info.status === 'success' ? classes.successtext : classes.errortext
								}
							>
								{`User '${lastSaved}' ${info.message}`}
							</FormHelperText>
						)}
						<Grid
							container
							spacing={16}
							direction="row"
							justifyContent="space-around"
							className={classes.actions}
						>
							<Grid item>
								<Button fullWidth variant="contained" color="primary" onClick={onClose}>
									取消
								</Button>
							</Grid>
							<Grid item>
								<Button
									disabled={!this.state.allValid}
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
								>
									注册
								</Button>
							</Grid>
						</Grid>
					</form>
				</Paper>
			</Container>
		);
	}
}

const { errorSelector, registeredSelector } = authSelectors;

const mapStateToProps = state => {
	return {
		registered: registeredSelector(state),
		error: errorSelector(state)
	};
};

const mapDispatchToProps = {
	register: authOperations.register,
	userlist: authOperations.userlist
};

const connectedComponent = connect(
	mapStateToProps,
	mapDispatchToProps
)(Register);

export default withStyles(styles)(connectedComponent);
