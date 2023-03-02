import React, { Component } from 'react';
import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Image,
	ScrollView,
	Platform,
	Linking,
	AsyncStorage,
	ListView,
  TextInput,
  Alert,
  BackHandler
} from 'react-native';

import { header } from '../utils/navigationHeader';
import Drawer from 'react-native-drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MenuComponent from '../utils/components/NavigationDrawer';
import Css from '../utils/Css/Style';
import PopupDialog from 'react-native-popup-dialog';
import ImageSlider from 'react-native-image-slider';
import { CheckBox } from 'react-native-elements';
import url from '../utils/Api';
import * as Progress from 'react-native-progress';
import { listOffers } from '../utils/internationalisation';
import ModalDropdown from 'react-native-modal-dropdown';
import SnapShotView from 'react-native-snapshot-view';
import Share from 'react-native-share';
import { createStyles, maxWidth, minWidth } from 'react-native-media-queries';
import Autocomplete from 'react-native-autocomplete-input';

let businessMap = {};
let categoryMap = {};
let offerMap;

var radio_props = [
  {label: 'Gold', value: 0 },
  {label: 'Silver', value: 1 },
  {label: 'Bronze', value: 2 }
];

let shareImageBase64 = {};

export default class ListOffers extends Component {

	static navigationOptions = {
   		 header: false,
   		 drawerLabel: "List Offers",
 	 };

	constructor(props){
		super(props);
	}



	state = {
		phoneNo: '9893870563',
		email: 'john.doe@gmail.com',
		position: 1,
    interval: null,
    isChecked_gold: false,
    isChecked_silver: false,
    isChecked_bronze: false,
    priceLowToHigh: false,
    sortNameUp: false,
    dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
    myoffer:'',
    offerBusiness:'',
    offerCategory:'',
    checkCount:0,
    showLoader: true,
    sort: '',
    categoryDropName:'',
    categoryDropId:'',
    categoryDrop_id:'',
    searchText:'',
    searchVisible:false,
    validityLowToHigh: false,
    localityDropName: [],
    localityDrop_id : '',
    localityDropId: [],
    ssImage: '',
    shootNum : 0,
		localitys: [],
		query: '',
	}

  renderLoader(){
    return(
            this.state.showLoader?<View style={{justifyContent: 'center',alignItems:'center',flex:1}}><Progress.CircleSnail color={['red', 'green', 'blue']} style = {{marginTop:200}} /></View>:null
         );
  }

	componentDidMount() {
    BackHandler.addEventListener('hardwareBackbutton', this.handleBack.bind(this));
        this.setState({interval: setInterval(() => {
            this.setState({position: this.state.position === 2 ? 0 : this.state.position + 1});
        }, 2000)});
       AsyncStorage.getItem("User").then((value) => {
        var tmp = JSON.parse(value);
          this.setState({user_id: tmp});
      }).done(() => {this.getUser(); this.getBusinessLocality();});

    }

  componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackbutton');
  }

  handleBack(){
    this.props.navigation.goBack(null);
    return true;
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
        }).done(() => {this.getoffers(); this.getOfferType(); })
    }

    getBusinessLocality(){
			fetch(url.main + "business_locality" + url.transform).then(res => res.json()).then((json) => {

			//	const { business_locality: localitys } = json;
				this.setState({ localitys : json.business_locality });
				//	alert(JSON.stringify(street));
			});
      // fetch(url.main + 'business_locality' + url.transform, {
      //     method : 'GET',
      //     headers : {
      //       'Accept' : 'application/json',
      //       'Content-Type' : 'application/json'
      //     }
      // }).then((response) => response.json())
      //     .then((responseData) => {
      //       var localityDropId = responseData.business_locality.map(function (business_locality) {
      //         return (business_locality.id);
      //       })
      //       var localityDropName = responseData.business_locality.map(function (business_locality) {
      //         return (business_locality.name);
      //       })
			//
      //       this .setState({
      //         localityDropName: localityDropName,
      //         localityDropId: localityDropId
      //       })
      //     })
    }

    getOfferType(){
      fetch(url.main + "offer_type" + url.transform, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
        .then((responseData) => {
          //alert(JSON.stringify(responseData.offer_type));

					(responseData.offer_type).sort(function(a, b) {
					    var textA = a.name.toUpperCase();
					    var textB = b.name.toUpperCase();
					    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
					});

         var categoryDropName = responseData.offer_type.map(function(type){
          return (type.name);
         })
         var categoryDropId = responseData.offer_type.map(function(type) {
          return (type.id)
         })
         this.setState({
          categoryDropName: categoryDropName,
          categoryDropId: categoryDropId,
         })
      }).done();
    }

    redemeOffer(offer){
      //alert
        if(this.state.userData.user[0].points >= offer.category[0].point_required){
            fetch(url.main + 'user_offer', {
                method: "POST",
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id' : this.state.userData.user[0].id,
                'offer_id' : offer.id
            })
            }).then((response) => response.json())
                  .then((responseData) => {
                    this.updateTransaction(offer)
                    //this.updateOffer(offer);
                    //alert(responseData)
            }).done();
         }else{
                Alert.alert("","You don't have enough points!");
         }
    }

    updateOffer(offer){
      //alert(JSON.stringify(offer.quantity))
      var tmp_quantity_offer = offer.quantity - 1;
      //alert(qan)
      if(offer.quantity > 0){
        //alert(tmp_quantity_offer)
        fetch(url.main + "offers/" + offer.id, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'quantity' : tmp_quantity_offer,
      })
    }).then((response) => response.json())
    .then((responseData) => {
        this.getoffers()
      //alert(JSON.stringify(responseData));
  }).done();
        }

    }

    getoffers(){
      var fetchUrl = url.main + "offers" + url.transform + "&include=category,business" ;
      fetch(fetchUrl, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {
          //alert(JSON.stringify(responseData));
          var offerRev = responseData.offers;
          offerRev.reverse();
          var tmp_date = new Date("2018-05-30");
          var today_date = new Date();
          //alert(tmp_date < today_date);
           //alert(JSON.stringify(offerRev[12]));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(offerRev)
          })

          // var offerMap = {};
          // responseData.offers.map(function  (offer) {
          //   offerMap[offer.id] = offer;
          // })
      })
    }

    getFilteredOffer(){
      this.filterPopupDialog.dismiss();
      var fetchUrl;
      var categoryFilter = '';
      var isCategorySelected = false;
       if(this.state.isChecked_gold){
        isCategorySelected = true;
          categoryFilter += "1,";
        }
        if(this.state.isChecked_silver){
          isCategorySelected = true;
          categoryFilter += "2,";
        }
         if(this.state.isChecked_bronze){
          isCategorySelected = true;
          categoryFilter += "3,";
        }
        //alert(categoryFilter)
      if(this.state.categoryDrop_id === '' && this.state.localityDrop_id === ''){
        fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filter + "category_id,in," + categoryFilter;
      }else if(this.state.categoryDrop_id != '' && isCategorySelected == true && this.state.localityDrop_id != ''){
        fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filterArray + "category_id,in," + categoryFilter + url.filterArray + 'offer_type_id,eq,' + this.state.categoryDrop_id + url.filterArray + 'business_locality_id,eq,' + this.state.localityDrop_id;
      }else if(this.state.localityDrop_id != '' && this.state.categoryDrop_id != ''){
        fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filterArray + "offer_type_id,eq" + this.state.categoryDrop_id + url.filterArray + "business_locality_id,eq," + this.state.localityDrop_id;
      }else if(this.state.localityDrop_id != ''){
        fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filter + "business_locality_id,eq," + this.state.localityDrop_id;
      }else if(this.state.categoryDrop_id != '' ){
        fetchUrl = url.main + "offers" + url.transform + "&include=category,business" + url.filter + "offer_type_id,eq," + this.state.categoryDrop_id;
      }
      // alert(fetchUrl)
			// return null;
      fetch(fetchUrl, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json())
          .then((responseData) => {
         // alert(JSON.stringify(responseData));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.offers)
          })

          // var offerMap = {};
          // responseData.offers.map(function  (offer) {
          //   offerMap[offer.id] = offer;
          // })
      })
    }

    searchOffers(){
      this.setState({
        searchVisible: false
      })
      //alert("search Api")
      var fetchUrl = url.other + "search" ;
      fetch(fetchUrl, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "searchkey": this.state.searchText
        })
      }).then((response) => response.json())
          .then((responseData) => {
         // alert(JSON.stringify(responseData));
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.offers)
          })

          // var offerMap = {};
          // responseData.offers.map(function  (offer) {
          //   offerMap[offer.id] = offer;
          // })
      })
    }

    getSortedOffers(){
      this.sortPopupDialog.dismiss()
      if(this.state.sortClicked == 'points'){
        var fetchUrl = url.main + "offers" + url.transform + "&include=category,business" ;
        fetch(fetchUrl, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
            .then((responseData) => {
           // alert(JSON.stringify(responseData));

           if(this.state.sort === 'LtoH'){
              responseData.offers.sort(function(a, b) {
                  return parseFloat(a.category[0].point_required) - parseFloat(b.category[0].point_required);
              });
            }else if(this.state.sort === 'HtoL'){
              responseData.offers.sort(function(a, b) {
                return parseFloat(b.category[0].point_required) - parseFloat(a.category[0].point_required);
            });
            }


            // var offerMap = {};
            // responseData.offers.map(function  (offer) {
            //   offerMap[offer.id] = offer;
            // })

            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(responseData.offers)
            })
        })
      }else if(this.state.sortClicked == 'validity'){
        var order;
        if(this.state.validityLowToHigh){
          order = 'ASC';
        }else{
          order = 'DSC';
        }
        fetch(url.other + 'offer/sort/validity' , {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'order_validity' : order,
          })
        }).then((response) => response.json())
            .then((responseData) => {
           // alert(JSON.stringify(responseData));

           if(this.state.sort === 'LtoH'){
              responseData.offers.sort(function(a, b) {
                  return parseFloat(a.category[0].point_required) - parseFloat(b.category[0].point_required);
              });
            }else if(this.state.sort === 'HtoL'){
              responseData.offers.sort(function(a, b) {
                return parseFloat(b.category[0].point_required) - parseFloat(a.category[0].point_required);
            });
            }


            // var offerMap = {};
            // responseData.offers.map(function  (offer) {
            //   offerMap[offer.id] = offer;
            // })

            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(responseData.offers)
            })
        })
      }
    }

    updateTransaction(offer){
        fetch(url.main + 'points_transaction', {
        method: "POST",
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user_id' : this.state.userData.user[0].id,
            'amount' : offer.category[0].point_required,
            'type' : 'reedemed'
        })
        }).then((response) => response.json())
          .then((responseData) => {
            this.getupdatedUser(offer)
            this.updateOffer(offer);
        }).done();
    }

    getupdatedUser(offer){
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
            this.updateUser(offer);
            //alert(JSON.stringify(responseData));
        }).done()
    }

    updateUser(offer){
        var points;
      if (this.state.userData.user[0].points === null){
        points = 0;
      }else{
        points = this.state.userData.user[0].points;
      }
      var less = offer.category[0].point_required;
      var deductPoints = parseInt(points) - less;
     // alert(addPoints)
      fetch(url.main + 'user/' + this.state.userData.user[0].id , {
          method: "PUT",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          'points' : deductPoints
        })
      }).then((response) => response.json())
      .then((responseData) => {
        Alert.alert('', 'Congratulations! Your purchase was successfull');
      }).done();
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

	openMap(){
    //alert(this.state.offerBusiness.name)
		 Platform.select({
        ios: () => {
            Linking.openURL('http://maps.apple.com/maps?ll=' + this.state.offerBusiness.lat + ',' + this.state.offerBusiness.long);
        },
        android: () => {
            Linking.openURL('http://maps.google.com/maps?ll=' + this.state.offerBusiness.lat + ',' + this.state.offerBusiness.long);
        }
    })();
	}

	openCall(){
		Linking.openURL('tel:' + this.state.phoneNo);
	}

	openMail(){
		Linking.openURL('mailto:'+ this.state.email);
	}

  on_select_type(idx, value){
    //alert(idx + value);
    this.setState({
      categoryDrop_id: this.state.categoryDropId[idx]
    })
  }

  on_select_locality(idx, value){
    this.setState({
      localityDrop_id: this.state.localityDropId[idx]
    })
  }

  searchField = (input) => {
    this.setState({
      searchText: input
    })
  }

	findLocality(query) {
	    if (query === '') {
	      return [];
	    }

	    const { localitys } = this.state;
	    const regex = new RegExp(`${query.trim()}`, 'i');
			// alert(JSON.stringify(regex))
			return localitys.filter(locality => locality.name.search(regex) >= 0);
  	}

  shareSs(image){
      shareImageBase64 = {
        title: "React Native",
        message: "Checkout the offer on myGreenPurse",
        url: image,
        subject: "Share Link" //  for email
    };
    if(image != null){
      Share.open(shareImageBase64)
    }
    
    }

	render(){
    var validityDate = new Date(this.state.myoffer.validity);
    var date = new Date();
		const { query } = this.state;
    	const localitys = this.findLocality(query);
    	const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
		return(
			<View style={{ flex: 1,backgroundColor:'#eee', flexDirection:'column'}}>
       <SnapShotView
            fileName={"Image" + date.getDate()+(date.getMonth()+1)+date.getFullYear()+date.getHours()+date.getMinutes()}
            shotNumber={this.state.shootNum}
            style = {{flex: 1}}
            onShoted={events => {
              this.setState({ssImage : events.nativeEvent.filePath})
              this.shareSs(events.nativeEvent.filePath);
              console.log(' onShoted : ', events.nativeEvent.filePath); // filePath is the .png path
            }}>
					<View style={Css.header_main}>
						<View style = {Css.header_menu_view}>
							<TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
								<Entypo name="menu" size={25} color="white" />
							</TouchableOpacity>
						</View>
						<View style = {{alignItems:"center", width:responsiveWidth(75), justifyContent:'center',}}>
							<Text style ={Css.header_main_text}>{listOffers.headerTitle}</Text>
						</View>
					</View>
					<View style={[Css.header_main, {borderTopWidth:0.5, borderColor:'#fff'}]}>
						<View style = {{width: responsiveWidth(33.33), borderRightWidth:0.5, borderColor:'#fff', flexDirection:'row', alignItems:'center'}}>
							<TouchableOpacity style = {{flexDirection:'row', width:responsiveWidth(33.33)}} onPress = {() => this.sortPopupDialog.show()} >
								<View style = {{justifyContent:'center',alignItems:'flex-end', width: responsiveWidth(19.998)}}>
									<Text style = {{color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-Bold', paddingRight: 7}} >{listOffers.sortText}</Text>
								</View>
								<View style = {{justifyContent:'center',alignItems:'flex-start', width: responsiveWidth(13.332)}}>
									<FontAwesome name = "sort-amount-asc" color = "#fff" size = {16}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style = {{width: responsiveWidth(33.33),flexDirection:'row', alignItems:'center', borderRightWidth:0.5, borderColor:'#fff',}}>
							<TouchableOpacity style = {{flexDirection:'row', width:responsiveWidth(33.33)}} onPress = {() => this.filterPopupDialog.show()}>
								<View style = {{justifyContent:'center',alignItems:'flex-end', width: responsiveWidth(19.998)}}>
									<Text style = {{color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-Bold', }} >{listOffers.filterText}</Text>
								</View>
								<View style = {{justifyContent:'center',alignItems:'flex-start', width: responsiveWidth(13.332)}}>
									<FontAwesome name = "filter" color = "#fff" size = {16} style = {{paddingLeft:7}}/>
								</View>
							</TouchableOpacity>
						</View>
	          <View style = {{width: responsiveWidth(33.33),flexDirection:'row', alignItems:'center'}}>
	            <TouchableOpacity style = {{flexDirection:'row', width:responsiveWidth(33.33)}} onPress = {() => this.setState({searchVisible: !this.state.searchVisible})}>
	              <View style = {{justifyContent:'center',alignItems:'flex-end', width: responsiveWidth(19.998)}}>
	                <Text style = {{color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily:'Muli-Bold'}} >{listOffers.searchText}</Text>
	              </View>
	              <View style = {{justifyContent:'center',alignItems:'flex-start', width: responsiveWidth(13.332)}}>
	                <FontAwesome name = "search" color = "#fff" size = {16} style = {{paddingLeft:7}}/>
	              </View>
	            </TouchableOpacity>
	          </View>
					</View>
	        {this.state.searchVisible && this.renderSearch()
	        }
					<ScrollView>
						<View style = {{flexDirection:'column', alignItems:'center'}} >
							<ListView
	              dataSource = {this.state.dataSource}
	              renderRow = {this.renderOffers.bind(this)}
	            />
						</View>
					</ScrollView>

	  				<PopupDialog
	            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
	            width = {responsiveWidth(85)}
	            height = {responsiveHeight(80)} >

	            <View style = {{flexDirection: 'column', position: 'relative', backgroundColor: '#fff'}}>
	                <TouchableOpacity onPress = {() => this.popupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	                    <FontAwesome name = "close" color = '#fff' size ={13} />
	                </TouchableOpacity>
	                <View style = {{marginBottom: 20}}>
	                    <ImageSlider images = {[this.state.myoffer.images1,this.state.myoffer.images2, this.state.myoffer.images3]}
	                        position={this.state.position}
	                        onPositionChanged={position => this.setState({position})}
	                        height = {responsiveHeight(23)}
	                        style = {{borderRadius: 5}} />
	                </View>
	                <View style = {{alignItems:'center'}}>
	                    <Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.5)}} >{this.state.myoffer.title}</Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), }} >
	                    <Text numberOfLines = {3} style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 10}} >{this.state.myoffer.description} </Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'column',alignItems:'center'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(2), paddingLeft: 25, paddingTop: 10}} >{this.state.offerBusiness.name}</Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), }} >
	                    <Text numberOfLines = {3} style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 10}} >{this.state.offerBusiness.description} </Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.validityText} :</Text>
	                    <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{validityDate.getDate()}/{validityDate.getMonth()+1}/{validityDate.getFullYear()}</Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.pointsText} :</Text>
	                    <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerCategory.point_required} pts</Text>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.locationText} :</Text>
	                    <TouchableOpacity onPress = {() => this.openMap()}>
	                        <Image source = {require("../../public/google.png")} style = {{width: responsiveFontSize(1.5), height: responsiveHeight(2), marginTop: 8, marginLeft: 5}} />
	                    </TouchableOpacity>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.contactText} :</Text>
	                    <TouchableOpacity onPress = {() => this.openCall()} >
	                        <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.phone_no}</Text>
	                    </TouchableOpacity>
	                </View>
	                <View style = {{width: responsiveWidth(50), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.emailText} :</Text>
	                    <TouchableOpacity onPress = {() => this.openMail()} >
	                        <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.email}</Text>
	                    </TouchableOpacity>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.addressText} :</Text>
	                    <View style = {{width: responsiveWidth(62)}}>
	                        <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.address}</Text>
	                    </View>
	                </View>
	                <View style = {{width: responsiveWidth(80), flexDirection:'row'}} >
	                    <Text style = {{color: '#46b07b', fontFamily: 'Muli-ExtraBold', fontSize: responsiveFontSize(1.5), paddingLeft: 25, paddingTop: 5}} >{listOffers.websiteText} :</Text>
	                    <TouchableOpacity onPress = {() => Linking.openURL('http://'+this.state.offerBusiness.website)}>
	                    <Text style = {{color: '#7A7A7A', fontFamily: 'Muli-Light', fontSize: responsiveFontSize(1.5), paddingLeft: 5, paddingTop: 5}}>{this.state.offerBusiness.website}</Text>
	                    </TouchableOpacity>
	                </View>
	                <View style = {{justifyContent:'center', flexDirection: 'row'}} >
	                    <TouchableOpacity style = {{width: responsiveWidth(30)}} onPress = {() => { Alert.alert('', 'Do you want to buy this coupon ?',[{text: 'Cancel', onPress: () => console.log('Cancel Pressed!'), style: 'cancel' }, {text: 'Ok', onPress: () => this.redemeOffer(this.state.myoffer)}])
	                        }} >
	                        <View style = {{backgroundColor:'#46b07b', justifyContent: 'center', width: responsiveWidth(30), height: responsiveHeight(4), borderRadius: 2, marginTop: 8, marginLeft:5}} >
	                            <Text style = {{color: "white", fontFamily: "Muli-Black", fontSize: responsiveFontSize(1.5), alignSelf:'center'}} >{listOffers.redemedButtonText}</Text>
	                        </View>
	                    </TouchableOpacity>
	                    <TouchableOpacity onPress = {() => {const shootNum1 = this.state.shootNum + 1; this.setState({shootNum : shootNum1});}}>
	                      <View style = {{backgroundColor:'#46b07b', justifyContent: 'center', width: responsiveWidth(10), height: responsiveHeight(4), borderRadius: 2, marginTop: 8, marginLeft:5, justifyContent:'center', alignItems: 'center'}} >
	                        <Entypo name = "share" color = "#fff" size = {18} />
	                      </View>
	                    </TouchableOpacity>
	                </View>
	            </View>

	          </PopupDialog>



	      	<PopupDialog
	      		ref={(popupDialog) => { this.sortPopupDialog = popupDialog; }}
	      		width = {responsiveWidth(85)}
	      		height = {responsiveHeight(33)}
	      		//dialogStyle = {{borderRadius: 0}}
	      		>
	      		<View style = {{width: responsiveWidth(85), height: responsiveHeight(20)}}>
	      			<TouchableOpacity onPress = {() => this.sortPopupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
	        			<FontAwesome name = "close" color = '#fff' size ={13} />
	      			</TouchableOpacity>
	      			<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
	      				<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{listOffers.popupSortText}</Text>
	      			</View>
	      			<View style = {{flexDirection:'column'}} >
	      				<View style = {{marginTop:10, flexDirection: 'column'}}>
	      					{this.state.priceLowToHigh && <TouchableOpacity onPress ={() => {this.setState({priceLowToHigh: !this.state.priceLowToHigh, sort: 'LtoH', sortClicked: 'points'}); }} style = {{flexDirection: 'row'}}>
	      						            					<Text style = {{color: '#46b07b', paddingLeft: 20, fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.priceLowToHighText}</Text>
	      						            					<FontAwesome name = "sort-up" color = '#46b07b' size ={18}  style = {{paddingTop: 10, paddingLeft:10}}/>
	      					            					</TouchableOpacity>
	      					}
	      					{!this.state.priceLowToHigh && <TouchableOpacity onPress ={() => {this.setState({priceLowToHigh: !this.state.priceLowToHigh, sort: 'HtoL', sortClicked: 'points'}); }} style = {{flexDirection: 'row'}}>
	      						            					<Text style = {{color: '#46b07b', paddingLeft: 20, fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.priceHighToLow}</Text>
	      						            					<FontAwesome name = "sort-down" color = '#46b07b' size ={18}  style = {{paddingTop: 5, paddingLeft:10}}/>
	      					            					</TouchableOpacity>
	      					}
	                {this.state.validityLowToHigh && <TouchableOpacity onPress ={() => {this.setState({validityLowToHigh: !this.state.validityLowToHigh, sortClicked: 'validity'}); }} style = {{flexDirection: 'row', marginTop: 10}}>
	                                        <Text style = {{color: '#46b07b', paddingLeft: 20, fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.validityLowToHigh}</Text>
	                                        <FontAwesome name = "sort-up" color = '#46b07b' size ={18}  style = {{paddingTop: 10, paddingLeft:10}}/>
	                                      </TouchableOpacity>
	                }
	                {!this.state.validityLowToHigh && <TouchableOpacity onPress ={() => {this.setState({validityLowToHigh: !this.state.validityLowToHigh, sortClicked: 'validity'}); }} style = {{flexDirection: 'row', marginTop: 10}}>
	                                        <Text style = {{color: '#46b07b', paddingLeft: 20, fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.validityHighToLow}</Text>
	                                        <FontAwesome name = "sort-down" color = '#46b07b' size ={18}  style = {{paddingTop: 5, paddingLeft:10}}/>
	                                      </TouchableOpacity>
	                }
	      				</View>
	              <View style = {{alignItems: 'center',marginTop:20, height: responsiveHeight(8), width: responsiveWidth(85)}} >
	                <TouchableOpacity onPress = {() => this.getSortedOffers()} style = {{height: responsiveHeight(6), width: responsiveWidth(30), backgroundColor:"#46b07b", alignItems:'center', justifyContent:'center'}} >
	                  <Text style = {{color:'#fff', fontSize: responsiveFontSize(2.4), fontFamily:'Muli-ExtraBold'}} >{listOffers.applyButtonText}</Text>
	                </TouchableOpacity>
	              </View>
	      			</View>
	      		</View>
	      	</PopupDialog>
       </SnapShotView>
			 <PopupDialog
					ref={(popupDialog) => { this.filterPopupDialog = popupDialog; }}
					width = {responsiveWidth(85)}
					height = {responsiveHeight(70)}
					//dialogStyle = {{borderRadius: 0}}
					>

										<View style = {{width: responsiveWidth(85), height: responsiveHeight(60)}}>
											<TouchableOpacity onPress = {() => this.filterPopupDialog.dismiss()}  style = {{position: 'absolute',width: responsiveWidth(5), height: responsiveHeight(3), backgroundColor:'#46b07b', zIndex: 999, borderRadius: 100, top: 0, right: 0,alignItems:'center', justifyContent:'center'}}>
												<FontAwesome name = "close" color = '#fff' size ={13} />
											</TouchableOpacity>
											<View style = {{width: responsiveWidth(85), height:responsiveHeight(8),borderBottomWidth:2, borderColor:'#46b07b', alignItems:'center', justifyContent:'center'}} >
												<Text style = {{color: '#46b07b', fontSize: responsiveFontSize(2.8), fontFamily:'Muli-ExtraBold'}} >{listOffers.popupFilterHead}</Text>
											</View>
											<View style = {{flexDirection:'column'}} >
											<View style = {{alignItems:'center'}}>
												<Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.popupFilterbyLocality}</Text>
											</View>
											<View style = {{height: responsiveHeight(7.2), width: responsiveWidth(60), marginBottom:10, marginTop: 10, alignSelf:'center'}}>
											<Autocomplete
												autoCapitalize="none"
													autoCorrect={false}
													containerStyle={{width: responsiveWidth(70),position: 'absolute', zIndex:1, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light', alignSelf:'center'}}
													inputContainerStyle={{height: responsiveHeight(7.2),borderRadius: 3,borderWidth: 1.2,borderColor:'#7A7A7A'}}
													listContainerStyle={{width: responsiveWidth(70),position:'relative', backgroundColor:'transparent', borderRadius: 3, fontSize: responsiveFontSize(1.7), fontFamily: 'Muli-Light',}}
													data={localitys.length === 1 && comp(query, localitys[0].name) ? [] : localitys}
													defaultValue={query}
													onChangeText={text => this.setState({ query: text })}
													placeholder={listOffers.localityDrop}
													renderItem={({ name,id }) => (
														<TouchableOpacity onPress={() => {this.setState({ query: name,localityDrop_id:id });}}>

															<Text>
																{name}
															</Text>
														</TouchableOpacity>
													)}
												/>
								</View>
							<View style = {{alignItems:'center'}}>
								<Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.popupFilterType}</Text>
							</View>
							<CheckBox
								title={listOffers.bronzeTitle}
								textStyle={{
									color: '#7A7A7A',
									fontSize: responsiveFontSize(2),
									fontFamily: 'Muli-Light'
								}}
								checked={this.state.isChecked_bronze}
								onPress={this.toggle_bronze}
								//fontFamily='Muli-Light'
								checkedColor='#46b07b'
								containerStyle = {{
									backgroundColor: 'transparent',
									borderWidth: 0,
									paddingBottom: 0,
								}} />
							<CheckBox
								title={listOffers.silverTitle}
								textStyle={{
									color: '#7A7A7A',
									fontSize: responsiveFontSize(2),
									fontFamily: 'Muli-Light'
								}}
								checked={this.state.isChecked_silver}
								onPress={this.toggle_silver}
								//fontFamily='Muli-Light'
								checkedColor='#46b07b'
								containerStyle = {{
									backgroundColor: 'transparent',
									paddingTop: 0 ,
									borderWidth: 0,
									paddingBottom: 0,
								}} />

							<CheckBox
									title={listOffers.goldTitle}
									textStyle={{
										color: '#7A7A7A',
										fontSize: responsiveFontSize(2),
										fontFamily: 'Muli-Light'
									}}
									checked={this.state.isChecked_gold}
									onPress={this.toggle_gold}
									//fontFamily='Muli-Light'
									checkedColor='#46b07b'
									containerStyle = {{
										backgroundColor: 'transparent',
										paddingTop: 0,
										borderWidth: 0,
										paddingBottom: 0,

									}} />
							<View style = {{alignItems:'center'}}>
								<Text style = {{color: '#46b07b', fontFamily:'Muli-ExtraBold', fontSize:responsiveFontSize(2.4), paddingTop: 5}} >{listOffers.popupFilter}</Text>
							</View>
							<ModalDropdown
								style={{marginBottom:10, width: responsiveWidth(70), borderWidth:1, backgroundColor: 'transparent', height:responsiveHeight(7), marginTop: 10,borderColor:'#7A7A7A', alignSelf:'center',borderRadius: 3}}
								textStyle={{fontFamily: 'Muli-Light', fontSize: responsiveFontSize(2.3), color:'#000', paddingTop: 10,paddingLeft:15}}
								defaultValue={listOffers.typeDrop}
								dropdownStyle={{width: responsiveWidth(70),height: responsiveHeight(20.5), borderWidth:1, marginTop: 10, backgroundColor:'transparent', borderColor:'#7A7A7A'}}
								dropdownTextStyle={{color:'#000', fontSize: responsiveFontSize(2.3), fontFamily:'Muli-Light', paddingLeft:10,backgroundColor:'#fff'}}
								options = {this.state.categoryDropName}
								//defaultIndex = {this.state.nameIndex}
								onSelect={(idx, value) => this.on_select_type(idx, value)} />

							<View style = {{alignItems: 'center', height: responsiveHeight(8), width: responsiveWidth(85)}} >
								<TouchableOpacity onPress = {() => this.getFilteredOffer()} style = {{height: responsiveHeight(6), width: responsiveWidth(30), backgroundColor:"#46b07b", alignItems:'center', justifyContent:'center'}} >
									<Text style = {{color:'#fff', fontSize: responsiveFontSize(2.4), fontFamily:'Muli-ExtraBold'}} >{listOffers.applyButtonText}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
			 </PopupDialog>
			</View>

		)
	}

  renderSearch(){
    return(
        <View style = {[Css.header_main, {borderTopWidth:1, borderColor:'#fff', alignItems:'center'}]}>
                    <TextInput
                      //value= {this.state.s}
                      style={{ color: '#000', marginLeft: 10, height: responsiveHeight(6.5), width: responsiveWidth(88) , backgroundColor:'white', borderRadius: 3, paddingLeft: 15, fontSize: responsiveFontSize(2.3), fontFamily: 'Muli-Light', borderWidth: 1, borderColor:'#7A7A7A' }}
                      placeholder= {listOffers.searchPlaceholder}
                      placeholderTextColor = "#000"
                      underlineColorAndroid = 'transparent'
                      onChangeText={e => this.searchField(e)}
                      editable={true}
                      secureTextEntry = {false}
                      onSubmitEditing = {() => this.searchOffers()}
                    />
                    <TouchableOpacity onPress = {() => this.searchOffers()} style = {{alignItems:'center', justifyContent:'center', marginLeft: 9}} >
                      <FontAwesome name = "search" size = {20} color = "white"/>
                    </TouchableOpacity>
                  </View>
    );

  }

	  toggle_gold = (checked) => {
	    this.setState({
	      isChecked_gold: !this.state.isChecked_gold,
	    })

	  }

	  toggle_silver = (checked) => {
	    this.setState({
	      isChecked_silver: !this.state.isChecked_silver,
	    })
	  }

	  toggle_bronze = (checked) => {
	    this.setState({
	      isChecked_bronze: !this.state.isChecked_bronze,
	    })
	  }

	  renderOffers(offer){
	  	var date = new Date(offer.validity);
      var catName = offer.category[0].name;
      var today = new Date();
      if(offer.quantity == 0){
        return null;
      }else{
        if(date < today){
          return null;
        }else{
          if(offer.offer_status == 0){
            return null;
          }else{
            return(
            <TouchableOpacity onPress = {() => this.openPopup(offer) } >
            <View style = {{marginTop: 15,marginBottom:15,backgroundColor: "#fff", height: responsiveHeight(36), width: responsiveWidth(85), borderRadius:4, elevation:6, flexDirection: 'row'}}>
              <View style = {{width: responsiveWidth(27), alignItems:'center',marginTop:8, marginLeft:4}} >
                <Image source = {{uri: offer.images}} style = {{width: responsiveWidth(19.2), height:responsiveHeight(30),borderRadius: 5, marginTop:12.5 }} />
              </View>
              <View style = {{flexDirection:'column', width: responsiveWidth(58)}} >
                <View style = {{marginTop:15, marginLeft:5, flexDirection:'row'}}>
                  <View style = {{width: responsiveWidth(40)}}>
                  <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.title}</Text>
                  </View>
                  {catName == 'Gold' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                  <Image source ={require('../../public/Gold_Icon.png')} style = {styles.dollorImage}/>
                                </View>
                  }
                  {catName == 'Silver' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                  <Image source ={require('../../public/silver_Icon.png')} style = {styles.dollorImage}/>
                                </View>
                  }
                  {catName == 'Bronze' && <View style = {{width: responsiveWidth(20), alignItems:'center', justifyContent:'center'}}>
                                  <Image source ={require('../../public/bronze_Icon.png')} style = {styles.dollorImage}/>
                                </View>
                  }
                </View>
                <View style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53),}}>
                  <Text numberOfLines = {2} style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.description}</Text>
                </View>
                <View style = {{marginTop:5, marginLeft:5}}>
                  <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.9), fontFamily: "Muli-ExtraBold"}} >{offer.business[0].name}</Text>
                </View>
                <View style = {{marginTop:5, marginLeft:5, width: responsiveWidth(53)}}>
                  <Text numberOfLines = {2} style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} >{offer.business[0].description}</Text>
                </View>
                <View style = {{marginTop:5, marginLeft:5, flexDirection:'row', height: responsiveHeight(2)}}>
                  <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{listOffers.validityText} : </Text>
                  <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()} </Text>
                </View>
                <View style = {{marginTop:5, marginLeft:5, flexDirection:'row'}}>
                  <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{listOffers.pointsText} : </Text>
                  <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {offer.category[0].point_required} pts </Text>
                </View>
                <View style = {{marginTop:5, marginLeft:5, flexDirection:'row'}}>
                  <Text style = {{color: "#46b07b", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-ExtraBold"}} >{listOffers.remainigCoupons} : </Text>
                  <Text style = {{color: "#7A7A7A", fontSize: responsiveFontSize(1.4), fontFamily: "Muli-Light"}} > {offer.quantity}</Text>
                </View>
                <View style = {{flexDirection: 'row'}}>
                  <TouchableOpacity style = {{width: responsiveWidth(30)}} onPress = {() => { Alert.alert('', 'Do you want to buy this coupon ?',[{text: 'Cancel', onPress: () => console.log('Cancel Pressed!'), style: 'cancel' }, {text: 'Ok', onPress: () => this.redemeOffer(offer)}])
                  }} >
                    <View style = {{backgroundColor:'#46b07b', justifyContent: 'center', width: responsiveWidth(30), height: responsiveHeight(4), borderRadius: 2, marginTop: 8, marginLeft:5}} >
                      <Text style = {{color: "white", fontFamily: "Muli-Black", fontSize: 10, alignSelf:'center'}} >{listOffers.redemedButtonText}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style = {{backgroundColor:'#46b07b', justifyContent: 'center', width: responsiveWidth(10), height: responsiveHeight(4), borderRadius: 2, marginTop: 8, marginLeft:5, justifyContent:'center', alignItems: 'center'}} >
                    <Entypo name = "share" color = "#fff" size = {18} />
                  </View>
                </View>
              </View>

            </View>
          </TouchableOpacity>
          )
         }
       }
     }
	}

      openPopup(offer){
        //alert(JSON.stringify(offer));
        this.setState({
            myoffer: offer,
            offerBusiness: offer.business[0],
            offerCategory: offer.category[0],
    })
        this.popupDialog.show();
    }
}

const base = {
  dollorImage: {
    width:responsiveWidth(5),
    height: responsiveHeight(3),

  }
}

const threesixty = {
  dollorImage: {
    width:responsiveWidth(5.5),
    height: responsiveHeight(3),

  }
}

const twoeighty = {
  dollorImage: {
    width:responsiveWidth(5),
    height: responsiveHeight(3),

  }
}

const foursixteen = {
  dollorImage: {
    width:responsiveWidth(5.5),
    height: responsiveHeight(3),

  }
}

const styles = createStyles(
  base,
  minWidth(280, maxWidth(349, twoeighty)),
    minWidth(350, maxWidth(415, threesixty)),
  minWidth(416, maxWidth(767, foursixteen)),
  minWidth(768, maxWidth(1440, threesixty)),
);
