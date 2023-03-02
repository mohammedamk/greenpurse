import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import _ from 'lodash';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
//import { connect } from 'react-redux';

//import { setFavourite } from "../../../../../../reducers/favouriteReducer"
//import { navigate } from "../../../../../../../utils/navigationActions"
import * as defaultStyle from '../../../style';
// import styles from './style';


//@connect((state) => ({
    //favourites: state.favouriteReducer.favourites
 // }),
  //(dispatch) => ({
  //  setFavouriteA: (state) => dispatch(setFavourite(state))
  //})
//)
class DayImage extends Component {
  static propTypes = {
    // TODO: selected + disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),

    favourite: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.favourite) {
      return (
        <TouchableOpacity
          onPress={() => {
            //this.props.setFavouriteA(this.props.favourite);
            //navigate('FavouriteProfile', { favourite: this.props.favourite });
          }}
          style={styles.imageContainer}
        >
          
        </TouchableOpacity>
      );

    } else {
      return <View/>
    }
  }
}

export default DayImage;




const styles = StyleSheet.create({
  avatarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'

  },
  editText: {
    fontSize: 20
  },
  avatarLetter: {
    color: 'white',
    fontSize: 15,

  },
  avatarLetterContainer: {
    backgroundColor: 'grey',
    height: 28,
    width: 28,
    borderRadius: 14,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

  },
  imageContainer: {
    position: 'absolute',
    top: -17,
    height: 28,
    width: 28,
    borderRadius: 14,
    // overflow:
  },
  image: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },



})
