/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ListHeaderComponent, StyleSheet, Text, View, Button} from 'react-native';
import SwitchHealth from './components/UI/SwitchHealth';
import AppleHealthKit from 'rn-apple-healthkit';
import Svg, {Circle, Path, Defs, G, Use, Stop, Mask, LinearGradient} from 'react-native-svg';
// import LinearGradient from 'react-native-linear-gradient';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      data: {
        birthDate: undefined,
        age: undefined,
        weight: undefined,
        weightSample: [],
        heartRateSamples: []
      },
      loading: false,
      sendStatus: undefined
    }
  }

  sendData() {
    this.setState({loading: true});
    console.log('console.log(this.state.loading): ', this.state.loading);
    return this.getDataFromHealthKit();
  }

  getDataFromHealthKit() {
    let options = {
      permissions: {
          read: ["Height", "Weight", "StepCount", "DateOfBirth", "BodyMassIndex", "ActiveEnergyBurned", "HeartRate", "RespiratoryRate", "BiologicalSex"]
      }
    };

    let finalResult = {
      birthDate: undefined,
      age: undefined, 
      weight: undefined,
      weightSample: [],
      heartRateSamples: []
    }
    

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
          console.log("error initializing Healthkit: ", err);
          return;
      }
      // birthDate
      AppleHealthKit.getDateOfBirth(null, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (results && results.value) {
          finalResult.birthDate = results.value;
        }
        if (results && results.value) {
          finalResult.age = results.age;
        }

        // LatestHeight
        AppleHealthKit.getLatestHeight(null, (err, results) => {
          if (results && results.value) {
            finalResult.weight = results.value;
          }
        
          // WeightSamples
          let optionsWeightSamples = {
            unit: 'kg', // optional; default 'pound'
            startDate: (new Date(2016,4,27)).toISOString(), // required
            endDate: (new Date()).toISOString(), // optional; default now
            ascending: false,	// optional; default false
            limit:10, // optional; default no limit
          };
          AppleHealthKit.getWeightSamples(optionsWeightSamples, (err, results) => {
            if (err) {
              return;
            }
            finalResult.weightSample = results;

            // HeartRate
            let optionsHeartRateSamples = {
              unit: 'bpm', // optional; default 'bpm'
              startDate: (new Date(2016,4,27)).toISOString(), // required
              endDate: (new Date()).toISOString(), // optional; default now
              ascending: false, // optional; default false
              limit:10, // optional; default no limit
            };
            AppleHealthKit.getHeartRateSamples(optionsHeartRateSamples, (err, results) => {
              // if (this._handleHealthkitError(err, 'getDateOfBirth')) {
              //   console.log(err)
              //   return;
              // }
              console.log(err);
              finalResult.heartRateSamples = results;

              console.log('finalResult:', finalResult);
              this.setState({data: finalResult});
              this.postDataToApi();
            });
          });
        });
      });
    });
  };

  postDataToApi() {
    console.log("IN POST DATA API");
    console.log('this.state in post data', this.state.data);
    return fetch('http://fa13aa26.ngrok.io/submit-form', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.data)
    })
    .then((response) => {
      
      console.log(response)
      if (response && response.status) {
        if (response.status == '200') {
          this.setState({ sendStatus: 'success'})
        } else {
          this.setState({ sendStatus: 'error'})
        }
        
      }
      // this.setState({loading: false})
       
      return;
    })
    .catch((error) => {
      // this.setState({loading: false})
      // console.log('console.log(this.state.loading) error : ', this.state.loading)  
      console.log(error);
      this.setState({ sendStatus: 'error'})
      return;
    });
  };

  render() {
    console.log(this.state.sendStatus)
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.svgHeader}>
            <Svg width="30" height="30" viewBox="0 0 80 80" marginTop="2%">
              <Defs>
                <LinearGradient id="LinearGradient" x1="0%" y1="50%" y2="50%">
                    <Stop offset="0%" stopColor="#1DE6D3"/>
                    <Stop offset="100%" stopColor="#13F5CB"/>
                </LinearGradient>
                <Circle id="circle" cx="40" cy="40" r="40"/>
              </Defs>
              <G fill="none" fill-rule="evenodd">
                <Mask id="c" fill="#fff">
                  <Use href="#circle"/>
                </Mask>
                <Use fill="url(#LinearGradient)" href="#circle" />
              </G>
            </Svg>
          </View>
        </View>
        <View style={styles.container}>   
          <View style={styles.patientPanel}>
            <View style={styles.patientDescription}>
              <View style={styles.svg}>
                <Svg width="80" height="80" viewBox="0 0 80 80">
                  <Defs>
                    <LinearGradient id="LinearGradient" x1="0%" y1="50%" y2="50%">
                        <Stop offset="0%" stopColor="#1DE6D3"/>
                        <Stop offset="100%" stopColor="#13F5CB"/>
                    </LinearGradient>
                    <Circle id="circle" cx="40" cy="40" r="40"/>
                  </Defs>
                  <G fill="none" fill-rule="evenodd">
                    <Mask id="c" fill="#fff">
                      <Use href="#circle"/>
                    </Mask>
                    <Use fill="url(#LinearGradient)" href="#circle" />
                    <G fill="#FFF" fillRule="nonzero" mask="url(#c)">
                        <Path d="M40 46.414c-8.922 0-16.133-7.12-16.133-15.931 0-8.81 7.21-16.052 16.133-16.052 8.922 0 16.256 7.12 16.256 15.931 0 8.81-7.334 16.052-16.256 16.052zm0-27.155c-6.233 0-11.244 4.948-11.244 11.103 0 6.155 5.01 11.104 11.244 11.104 6.233 0 11.367-4.949 11.367-11.104 0-6.155-5.134-11.103-11.367-11.103zM69.456 82.741c-1.345 0-2.445-1.086-2.445-2.413 0-14.725-12.1-26.673-27.011-26.673S12.989 65.603 12.989 80.328c0 1.327-1.1 2.413-2.445 2.413-1.344 0-2.444-1.086-2.444-2.413 0-17.38 14.3-31.5 31.9-31.5 17.6 0 31.9 14.12 31.9 31.5 0 1.327-1.1 2.413-2.444 2.413z"/>
                    </G>
                  </G>
                </Svg>
              </View>
              <View style={styles.patientText}>
                <Text style={styles.patientName}>Alexandra Bertrand</Text>
                <Text style={styles.patientName}>28 ans</Text>
                <Text style={styles.patientName}>06 05 19 92 17</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.checkPanel}>
            <Text style={styles.checkText}>Connectez vos données :</Text>
            <View style={styles.connectedAppName}>
              <Text style={{margin: '5%', alignSelf: 'center',fontSize: 18}}>Health</Text>
              <SwitchHealth checked={true} />
            </View>
            <View style={styles.connectedAppName}>
              <Text style={{margin: '5%', alignSelf: 'center',fontSize: 18}}>Withings</Text>
              <SwitchHealth checked={false} />
            </View>
            <View style={styles.connectedAppName}>
              <Text style={{margin: '5%', alignSelf: 'center',fontSize: 18}}>Runkeeper</Text>
              <SwitchHealth checked={false}/>
            </View>
          </View>
          
          <View style={styles.buttonPanel}>
            <View style={styles.buttonContainer}>
              <Button
                style={{fontSize: 20, color: 'black'}}
                color={'white'}
                onPress={() => this.getDataFromHealthKit()}
                title="Envoyer"
              >
                Envoyer
              </Button>
            </View>    
          </View>    
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-around',
    fontFamily: 'Roboto-Regular',
    marginTop: 40
  },
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 28,
    width: 414,
    height: 50,
    shadowOffset:{  width: 0,  height: 2  },
    shadowColor: 'rgb(0, 45, 64)',
    shadowOpacity: 0.1,
    backgroundColor: '#ffffff'
  },  
  svgHeader: {
    marginTop: 8,
    marginRight: 33
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  checkPanel: {
    marginTop: 60,
    height: 123
  },
  checkText: {
    width: 324,
    height: 24,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: '#002d40',
    margin: '5%'
  },  
  connectedAppName: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonPanel: {
    height: 150,
    marginTop: 250
  },  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#1de6d3', 
    width: 138,
    height: 40,
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
    borderRadius: 22, 
    fontSize: 25
  }, 
  patientDescription: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  svg: {
    alignSelf: 'center'
  },
  patientName: {
    fontSize: 18,
    padding: 5,
    color: '#2a2a2a'
  },
  patientPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
    width: 374,
    height: 123,
    borderRadius: 4,
    shadowOffset:{  width: 0,  height: 2  },
    shadowColor: 'rgb(0, 45, 64)',
    shadowOpacity: 0.1,
    backgroundColor: '#ffffff'
  }, 
  patientText: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: 30
  }
});
