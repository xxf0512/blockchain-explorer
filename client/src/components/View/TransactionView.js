/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FontAwesome from 'react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';
import JSONTree from 'react-json-tree';
import { transactionType } from '../types';
import Modal from '../Styled/Modal';
/* eslint-disable */
const readTheme = {
	base00: '#f3f3f3',
	base01: '#2e2f30',
	base02: '#515253',
	base03: '#737475',
	base04: '#959697',
	base05: '#b7b8b9',
	base06: '#dadbdc',
	base07: '#fcfdfe',
	base08: '#e31a1c',
	base09: '#e6550d',
	base0A: '#dca060',
	base0B: '#31a354',
	base0C: '#80b1d3',
	base0D: '#3182bd',
	base0E: '#756bb1',
	base0F: '#b15928'
};
const writeTheme = {
	base00: '#ffffff',
	base01: '#2e2f30',
	base02: '#515253',
	base03: '#737475',
	base04: '#959697',
	base05: '#b7b8b9',
	base06: '#dadbdc',
	base07: '#fcfdfe',
	base08: '#e31a1c',
	base09: '#e6550d',
	base0A: '#dca060',
	base0B: '#31a354',
	base0C: '#80b1d3',
	base0D: '#3182bd',
	base0E: '#756bb1',
	base0F: '#b15928'
};
/* eslint-enable */
const styles = theme => ({
	listIcon: {
		color: '#ffffff',
		marginRight: 20
	},
	JSONtree: {
		'& ul': {
			backgroundColor: 'transparent !important',
			color: '#fff'
		}
	},
	readset_null: {
		display: 'none'
	}
});

const reads = {
	color: '#2AA233'
};
const writes = {
	color: '#DD8016'
};

export class TransactionView extends Component {
	handleClose = () => {
		const { onClose } = this.props;
		onClose();
	};

	render() {
		const { transaction, classes } = this.props;
		if (transaction) {
			let baseUrl =
				window.location.protocol +
				'//' +
				window.location.hostname +
				':' +
				window.location.port;
			let directLink =
				baseUrl + '/?tab=transactions&transId=' + transaction.txhash;
			return (
				<Modal>
					{modalClasses => (
						<div className={modalClasses.dialog}>
							<Card className={modalClasses.card}>
								<CardTitle className={modalClasses.title}>
									<FontAwesome name="list-alt" className={classes.listIcon} />
									交易详情
									<button
										type="button"
										onClick={this.handleClose}
										className={modalClasses.closeBtn}
									>
										<FontAwesome name="close" />
									</button>
								</CardTitle>
								<CardBody className={modalClasses.body}>
									<Table striped hover responsive className="table-striped">
										<tbody>
											<tr>
												<th>交易ID:</th>
												<td>
													{transaction.txhash}
													<button type="button" className={modalClasses.copyBtn}>
														<div className={modalClasses.copy}>Copy</div>
														<div className={modalClasses.copied}>Copied</div>
														<CopyToClipboard text={transaction.txhash}>
															<FontAwesome name="copy" />
														</CopyToClipboard>
													</button>
												</td>
											</tr>
											<tr>
												<th>验证代码:</th>
												<td>{transaction.validation_code}</td>
											</tr>
											<tr>
												<th>载荷提议哈希:</th>
												<td>{transaction.payload_proposal_hash}</td>
											</tr>
											<tr>
												<th>创建组织MSP:</th>
												<td>{transaction.creator_msp_id}</td>
											</tr>
											<tr>
												<th>背书节点MSP:</th>
												<td>{transaction.endorser_msp_id}</td>
											</tr>
											<tr>
												<th>链码名称:</th>
												<td>{transaction.chaincodename}</td>
											</tr>
											<tr>
												<th>交易类型:</th>
												<td>{transaction.type}</td>
											</tr>
											<tr>
												<th>创建时间:</th>
												<td>{transaction.createdt}</td>
											</tr>
											<tr>
												<th>Direct Link:</th>
												<td>
													{directLink}
													<button type="button" className={modalClasses.copyBtn}>
														<div className={modalClasses.copy}>Copy</div>
														<div className={modalClasses.copied}>Copied</div>
														<CopyToClipboard text={directLink}>
															<FontAwesome name="copy" />
														</CopyToClipboard>
													</button>
												</td>
											</tr>
											<tr className={!transaction.read_set && classes.readset_null}>
												<th style={reads}>Reads:</th>
												<td className={classes.JSONtree}>
													<JSONTree
														data={transaction.read_set}
														theme={readTheme}
														invertTheme={false}
													/>
												</td>
											</tr>
											<tr className={!transaction.read_set && classes.readset_null}>
												<th style={writes}>Writes:</th>
												<td className={classes.JSONtree}>
													<JSONTree
														data={transaction.write_set}
														theme={writeTheme}
														invertTheme={false}
													/>
												</td>
											</tr>
										</tbody>
									</Table>
								</CardBody>
							</Card>
						</div>
					)}
				</Modal>
			);
		}
		return (
			<Modal>
				{modalClasses => (
					<div>
						<CardTitle className={modalClasses.title}>
							<FontAwesome name="list-alt" className={classes.listIcon} />
							交易详情
							<button
								type="button"
								onClick={this.handleClose}
								className={modalClasses.closeBtn}
							>
								<FontAwesome name="close" />
							</button>
						</CardTitle>
						<div align="center">
							<CardBody className={modalClasses.body}>
								<span>
									{' '}
									<FontAwesome name="circle-o-notch" size="3x" spin />
								</span>
							</CardBody>
						</div>
					</div>
				)}
			</Modal>
		);
	}
}

TransactionView.propTypes = {
	transaction: transactionType
};

TransactionView.defaultProps = {
	transaction: null
};

export default withStyles(styles)(TransactionView);
