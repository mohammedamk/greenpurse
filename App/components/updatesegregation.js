import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  ListView,
  Alert,
  BackHandler,
  Dimensions,
	Image,
	ScrollView
} from 'react-native';

import { header } from '../utils/navigationHeader';

//import NavigationDrawer from '../utils/components/NavigationDrawer';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import PopupDialog from 'react-native-popup-dialog';
import url from '../utils/Api';
import moment from 'moment';
import { updateSegregation } from '../utils/internationalisation';

//import { MenuComponent } from './index';

var {height, width} = Dimensions.get('window');

export default class UpdateSegregation extends Component {

	static navigationOptions = {
   		 header: false,
       drawerLabel: "Update Segregation",
 	 	};

    state = {
      user_id: '',
      userData:'',
      date:'',
      time:'',
      length: 0,
			notice_id:'',
      lastupdate:[],
      segHistroy:[],
      updateSeg: false,
      segregationEmpty: true,
      segregationTime: '',
      endState:'',
      startState:'',
			bannerImage: '',
			bannerText: '',
			bannerDisable:false,
      dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
    }

    componentWillMount(){
      AsyncStorage.getItem("User").then((value) => {
        var tmp = JSON.parse(value);
          this.setState({user_id: tmp});
      }).done(() => {this.getUser(); this.getSegregationTime();});
      //alert(width)
      console.log(this.props.navigation)
      BackHandler.addEventListener('hardwareBackbutton', function () {
        BackHandler.exitApp();
      });
			this.checknotice();
			this.getBanner();
    }

		checknotice(){
			fetch(url.main + 'subscriber_message' + url.transform, {
			method: 'GET',
			headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
		}).then((response) => response.json())
			.then((responseData) => {
				//alert(JSON.stringify(responseData))
				if(responseData.subscriber_message[0].status == 2){
					this.setState({
						notice: responseData.subscriber_message[0].message,
						notice_id: responseData.subscriber_message[0].id
					})
						this.checkAsync()
						}else{

						}
					})
		}

		checkAsync(){

			AsyncStorage.getItem("notice").then((value) => {
				var tmp = JSON.parse(value);

				if(tmp != null){
						if(!(tmp.msg).match(this.state.notice)){
							this.noticePopupDialog.show();
						}
				}
			})
		}

		noticeClose(){
			this.noticePopupDialog.dismiss();
			var notice = {
				msg: this.state.notice,
				status: 'seen'
			}
			AsyncStorage.removeItem('notice')
			AsyncStorage.setItem('notice', JSON.stringify(notice));
		}

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackbutton');
    }

		getBanner(){
			fetch(url.other + "getBanner",{
				method: "GET",
				headers:{
					'Accept': 'application/json',
          'Content-Type': 'application/json'
				}
			}).then((response) => response.json())
				.then((responseData) => {
					//alert(JSON.stringify(responseData))
					if(responseData.code == 200){
						this.setState({
							bannerText: responseData.banner.title,
							bannerImage: responseData.banner.image
						})
					}else if(responseData.code == 100){
						this.setState({
							bannerDisable: true
						})
					}
				})
		}


    getUser(){
      fetch(url.main + "user" + url.transform + url.filter + "id,eq," + this.state.user_id, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {
            if(responseData === null){
              Alert.alert("","Network Error");
            }else{
              //AsyncStorage.setItem("User_Details", JSON.stringify(responseData));
              //alert(JSON.stringify(responseData))
              this.setState({
                userData: responseData
              })
            }
            //alert(JSON.stringify(responseData));
        }).done(() => this.getSegregationHistory())
    }

    getSegregationTime(){
      fetch(url.main + "segregation_time" + url.transform , {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {

              //AsyncStorage.setItem("User_Details", JSON.stringify(responseData));
              this.setState({
                segregationTime: responseData.segregation_time[0]
              })
              var startTime = responseData.segregation_time[0].start_time_hr;
              var endTime = responseData.segregation_time[0].end_time_hr;


              //alert(endTime)
              var date = new Date();
              var timeHours = date.getHours();
              //var timeMin = date.getMinutes();

               var d = new Date();
              //alert(timeMin)
              if(timeHours < endTime){
                //alert('Time hrs is small')
                this.setState({
                  date: new Date()
                })
              }else{
               // alert('Time hrs is High')
                this.setState({
                  date: new Date((new Date()).valueOf() + 1000*3600*24)
                })
              }
            //alert(JSON.stringify(responseData.segregation_time[0].end_time));
        }).done()
    }

    update(){
     var segDate;
      segDate = this.state.segHistroy.map(function (seg) {
       return (seg.date);
     })
       var d, date;
       d = new Date(this.state.date);
      if(this.state.lastupdate){
        //d = new Date(this.state.lastupdate.date);
        date = new Date(this.state.lastupdate.date);
      }else{
        date = new Date()
        date.setFullYear(2017, 12, 29);
      }
     // alert(date)
      // this.state.date

      if(date.getFullYear() == d.getFullYear() && date.getMonth() == d.getMonth() && date.getDate() == d.getDate()){
           this.popupDialog.dismiss();
            Alert.alert("","You have already segregated the waste today!")
      }else{
        //alert(d)
        //this.segregate();
        this.props.navigation.navigate('uploadsegregationpic', {userData: this.state.userData.user[0].id});
      }

     // alert(date)

      // if(date == d){
      //   this.popupDialog.dismiss();
      //   Alert.alert("","You have already segregated the waste today!")
      // }else{
      //   //alert('Update')
      //    this.popupDialog.dismiss();
      //    // fetch(url.main + 'segregation', {
      //    //    method: "POST",
      //    //    headers: {
      //    //      'Accept': 'application/json',
      //    //      'Content-Type': 'application/json'
      //    //    },
      //    //    body: JSON.stringify({
      //    //      'user_id' : this.state.userData.user[0].id,
      //    //      'date' : this.state.date
      //    //    })
      //    //  }).then((response) => response.json())
      //    //      .then((responseData) => {
      //    //        Alert.alert("","Congratulations! You've earned 50 points!")
      //    //       }).done(() => {
      //    //          this.updatePoints();
      //    //          this.updatePointsTransaction();
      //    //        });
      //   }
    }

    segregate(){
      this.popupDialog.dismiss();
         fetch(url.main + 'segregation', {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'user_id' : this.state.userData.user[0].id,
              'date' : this.state.date
            })
          }).then((response) => response.json())
              .then((responseData) => {
                Alert.alert("","Congratulations! You've earned 50 points!")
               }).done(() => {
                  this.updatePoints();
                  this.updatePointsTransaction();
                });
    }

    updatePoints(){
      var points;
      if (this.state.userData.user[0].points === null){
        points = 0;
      }else{
        points = this.state.userData.user[0].points;
      }
      var add = 50
      var addPoints = parseInt(points) + add;
     // alert(addPoints)
      fetch(url.main + 'user/' + this.state.userData.user[0].id , {
          method: "PUT",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          'points' : addPoints
        })
      }).then((response) => response.json())
      .then((responseData) => {
        //alert()
      }).done();
    }

    updatePointsTransaction(){
      fetch(url.main + 'points_transaction' , {
          method: "POST",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          'user_id' : this.state.userData.user[0].id,
          'amount' : '50',
          'type' : 'earned'
        })
      }).then((response) => response.json())
      .then((responseData) => {
        //alert()
      }).done(() => {this.getSegregationHistory(); this.getUser();});
    }

    getSegregationHistory(){
      fetch(url.main + 'segregation' + url.transform + url.filter + 'user_id,eq,' + this.state.userData.user[0].id, {
          method: "GET",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          }
      }).then((response) => response.json())
      .then((responseData) => {
        //alert(JSON.stringify(responseData.segregation))
        var i = parseInt(responseData.segregation.length)-1;
         //alert(JSON.stringify(responseData.segregation[i]))
        this.setState({
          lastupdate : responseData.segregation[i],
          segHistroy: responseData.segregation
        })
        if (i < 0){
          this.setState({
            segregationEmpty: true
          })
        }else{
           this.setState({
            segregationEmpty: false
          })
        }

      }).done();
    }


	render() {
    if(this.state.segregationEmpty === false){
      var date = new Date(this.state.lastupdate.date);
    }
		return(
      <View style={{flex:1, backgroundColor:'#eee'}}>
        <View style={Css.header_main}>
          <View style = {Css.header_menu_view}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerToggle', { UserDetails: this.state.userData })}>
              <Entypo name="menu" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View style = {Css.header_main_text_view}>
            <Text style ={Css.header_main_text}>{updateSegregation.headerTitle}</Text>
          </View>
        </View>
        <View style = {{flex: 1, flexDirection: 'column'}} >
          <View style = {{alignItems:'center', marginTop: 15}} >
            <Text style = {{color:'#46b07b', fontSize: responsiveFontSize(3), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.mainHeading}</Text>
          </View>
          <View style = {{alignItems:'center', marginTop: 80}} >
            <Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.9), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.timeHeading}</Text>
          </View>
          <View style = {{flexDirection:'row',width: responsiveWidth(85), height: responsiveHeight(8), backgroundColor:'#fff', alignSelf:'center', marginTop: 10,}} >
            <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}} >
              <Entypo name = "stopwatch" color = "#46b07b" size = {22} style = {{paddingRight: 15 }}/>
            </View>
            <View style = {{width: responsiveWidth(48), alignItems:'center', justifyContent:'center'}} >
              <Text style = {{color:'#000', fontSize: responsiveFontSize(2.1), fontFamily:'Muli-Regular'}}>{this.state.segregationTime.start_time_hr}:{this.state.segregationTime.start_time_min} {this.state.segregationTime.start_state} to {this.state.segregationTime.end_time_hr}:{this.state.segregationTime.end_time_min} {this.state.segregationTime.end_state}</Text>
            </View>
          </View>
          <View style = {{marginTop:15, alignItems:'center'}} >
              <TouchableOpacity style = {{width: responsiveWidth(85), height: responsiveHeight(7), backgroundColor:'#46b07b', alignItems:'center', justifyContent:'center'}} onPress = {() => this.update()} >
                <Text style = {{color:'#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.updateButtonText}</Text>
              </TouchableOpacity>
          </View>
          <View style = {{alignItems:'center', marginTop: 15}} >
            <Text style = {{color:'#46b07b', fontSize: responsiveFontSize(2.9), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.lastUpdateText}</Text>
          </View>
          {
            this.state.segregationEmpty === false ? <View style = {{flexDirection:'row',width: responsiveWidth(85), height: responsiveHeight(8), backgroundColor:'#fff', alignSelf:'center', marginTop: 10,}} >
            <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}} >
              <FontAwesome name = "calendar" color = "#46b07b" size = {20} style = {{paddingRight: 15 }}/>
            </View>
            <View style = {{width: responsiveWidth(45), alignItems:'center', justifyContent:'center'}} >
              <Text style = {{color:'#000', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-Regular'}}>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</Text>
            </View>
          </View> : <View style = {{marginTop: 10, alignSelf:'center'}} ><Text style = {{color:'#7A7A7A', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Regular'}}>{updateSegregation.noUpdatesText}</Text></View>
          }
					{this.state.bannerDisable == false && <View style = {{flexDirection:'row',width: responsiveWidth(85), height: responsiveHeight(20), backgroundColor:'#fff', alignSelf:'center', marginTop: 20,}}>
						<View style = {{width: responsiveWidth(35), alignSelf: 'center'}}>
							<Image source = {{uri: this.state.bannerImage}} style = {{width: responsiveWidth(34), height: responsiveHeight(20)}} />
						</View>
						<View style = {{width: responsiveWidth(49), marginTop: 5}}>
							<Text style = {{fontSize: responsiveFontSize(2), fontFamily: 'Muli-Regular', color: 'black'}}>{this.state.bannerText}</Text>
						</View>
					</View>}
        </View>
        <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                width = {responsiveWidth(85)}
                height = {responsiveHeight(30)} >
            <View style = {{width: responsiveWidth(85), height: responsiveHeight(30)}}>
                <TouchableOpacity onPress = {() => this.popupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
                  <FontAwesome name = "close" color = '#fff' size ={13} />
                </TouchableOpacity>
                <View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
                  <Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{updateSegregation.popupHeading}</Text>
                </View>
                <View style = {{marginTop: 15}} >
                  <Text style = {{color : "#46b07b" , fontFamily:'Muli-ExtraBold', fontSize: responsiveFontSize(2.5), paddingLeft: 15}} >{updateSegregation.popupQuestion}</Text>
                </View>
                <View style = {{flexDirection:'row', marginTop: 25}} >
                <TouchableOpacity onPress = {() => this.update()} style = {{width: responsiveWidth(34), height: responsiveHeight(6), backgroundColor:'#46b07b', marginLeft: 15, alignItems:'center', justifyContent:'center'}}>
                  <Text style = {{color:'#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.popupYesText}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => this.popupDialog.dismiss()} style = {{width: responsiveWidth(34), height: responsiveHeight(6), backgroundColor:'#46b07b', marginLeft: 30, alignItems:'center', justifyContent:'center'}}>
                  <Text style = {{color:'#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-ExtraBold'}}>{updateSegregation.popupNoText}</Text>
                </TouchableOpacity>
                </View>
            </View>
        </PopupDialog>
				<PopupDialog
							ref={(popupDialog) => { this.noticePopupDialog = popupDialog; }}
							width = {responsiveWidth(85)}
							height = {responsiveHeight(43)}
							dismissOnTouchOutside = {false}
							dismissOnHardwareBackPress = {false}
							//dialogStyle = {{borderRadius: 0}}
							>
							<View style = {{width: responsiveWidth(85), height: responsiveHeight(40)}}>
								<TouchableOpacity onPress = {() =>  this.noticeClose()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
									<FontAwesome name = "close" color = '#fff' size ={13} />
								</TouchableOpacity>
								<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
									<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >Hello!</Text>
								</View>
								<ScrollView>
								<View style = {{alignItems:'center', justifyContent:'center', marginTop: 10, marginLeft: 10, marginRight: 10}}>
									<Text style = {{color: '#000', fontSize: responsiveFontSize(2), fontFamily: 'Muli-ExtraBold', textAlign:'justify'}}>{this.state.notice}</Text>
								</View>
								</ScrollView>
							</View>
				</PopupDialog>
      </View>
		);
	}
}
