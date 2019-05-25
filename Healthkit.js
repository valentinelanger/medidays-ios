import React, { Component } from 'react';
import {Text} from 'react-native';
import AppleHealthKit from 'rn-apple-healthkit';

export default class Healthkit extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
      let options = {
        permissions: {
            read: ["Height", "Weight", "StepCount", "DateOfBirth", "BodyMassIndex", "ActiveEnergyBurned"],
            write: ["Height", "Weight", "StepCount", "BodyMassIndex", "Biotin", "Caffeine", "Calcium", "Carbohydrates", "Chloride", "Cholesterol", "Copper", "EnergyConsumed", "FatMonounsaturated", "FatPolyunsaturated", "FatSaturated", "FatTotal", "Fiber", "Folate", "Iodine", "Iron", "Magnesium", "Manganese", "Molybdenum", "Niacin", "PantothenicAcid", "Phosphorus", "Potassium", "Protein", "Riboflavin", "Selenium", "Sodium", "Sugar", "Thiamin", "VitaminA", "VitaminB12", "VitaminB6", "VitaminC", "VitaminD", "VitaminE", "VitaminK", "Zinc", "Water"]
        }
      };
  
      AppleHealthKit.initHealthKit(options, (err, results) => {
        if (err) {
            console.log("error initializing Healthkit: ", err);
            return;
        }
    
      // Height Example
      AppleHealthKit.getDateOfBirth(null, (err, results) => {
      if (this._handleHealthkitError(err, 'getDateOfBirth')) {
        return;
      }
        console.log(results)
      });
    
    });
  }

  render() {
    return (
      <Text>test</Text>
    )
  }
}