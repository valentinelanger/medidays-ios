

import React, {Component} from 'react';
import {Switch} from 'react-native';

export default class SwitchHealth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		}
	}

	toggleCheck() {
		this.setState({ checked: !this.state.checked });
	}

	render() {
		return (
			<Switch 
				onValueChange={() => 
					this.toggleCheck()
				}
				ios_backgroundColor={'#f0f0f0'}
				value={this.props.checked}
				trackColor={{false: '#f0f0f0', true: '#1de6d3'}}
				style={{margin: '5%', alignSelf: 'center'}}
			/>
		)
	}
}