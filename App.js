/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import Healthkit from './Healthkit';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { text: 'placeholder'}
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>HELLO </Text>
        <Text style={styles.instructions}>To get started, test HMR </Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <View style={styles.container}>
          <Text selectable style={styles.valou}>Hello Valou </Text>
        </View>
        <Healthkit />
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    justifyContent: 'center',
    backgroundColor: 'powderblue',
  },
  welcome: {
    fontSize: 20,
    backgroundColor: 'skyblue',
    textAlign: 'center',
    padding: 30,
  },
  instructions: {
    textAlign: 'center',
    flex: 1,
    color: '#333333',
    marginBottom: 5,
  },
  valou: {
    textAlign: 'center',
    flex: 1,
    backgroundColor: 'steelblue',
    fontSize: 35,
    marginBottom: 5,
  },
});
