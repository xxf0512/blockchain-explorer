/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import matchSorter from 'match-sorter';
import ReactTable from '../Styled/Table';
import { channelsType } from '../types';

class Channels extends Component {
	reactTableSetup = () => [
		{
			Header: 'ID',
			accessor: 'id',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['id'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 100
		},
		{
			Header: '通道名称',
			accessor: 'channelname',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['channelname'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: '区块数',
			accessor: 'blocks',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['blocks'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 125
		},
		{
			Header: '交易数',
			accessor: 'transactions',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['transactions'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 125
		},
		{
			Header: '创建时间',
			accessor: 'createdat',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['createdat'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		}
	];

	render() {
		const { channels } = this.props;
		return (
			<div>
				<ReactTable
					data={channels}
					columns={this.reactTableSetup()}
					defaultPageSize={5}
					filterable
					minRows={0}
					showPagination={channels.length >= 5}
				/>
			</div>
		);
	}
}

Channels.propTypes = {
	channels: channelsType.isRequired
};

export default Channels;
