'use strict'
import React,{
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  NavigatorIOS,
  Component,
  Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import Dimensions from 'Dimensions';
import ServiceType from './serviceType';
import Home from './Home.js';
var width = Dimensions.get('window').width;
export default class MyIndex extends Component{
  constructor(props){
    super(props);
   
    this.state = {

      imageurls:[]
    }

  }
  banner(urls){

 let bannerurls = urls;
      return bannerurls.map((bannerurl,i)=>{

        return (
            <View 
                key={i} 
                style={styles.slider}>
                <Image style={styles.image}
                    source={{uri:bannerurl}}
                  />             
            </View> 
        );


      });

  }
  componentDidMount(){
    Alert.alert(
      '温馨提示',
      '本网站正在升级中，部分功能可能暂时无法使用，敬请谅解！',
      [{text: '我知道了'}]
    );
    fetch('http://api.gujia007.com/v1/flash-data')
        .then((res) => {
         
               var urls = new Array();
                let datasource = JSON.parse(res._bodyText).items;
                for(let item of datasource){
                    
                    urls.push(item.image);                   
                }
               
                return urls;
        }).then((urls)=>{
                this.setState({imageurls: urls});
        });
    
  }
  
  render() {
    
    let urls = this.state.imageurls; 
     
      return (
        <View style={{flex:1}}>
        <ScrollView style={styles.scrollView}
          automaticallyAdjustContentInsets={true}
          snapToAlignment={'center'}
        >
          <Swiper style={styles.wrapper}

          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
            paginationStyle={{
            bottom: 0, right: null, left  : 10,
          }}
          removeClippedSubviews={false}
          automaticallyAdjustContentInsets={true}
            height={160}
            horizontal={true}
            autoplay={true}

            showsButtons={false}
            loop={true}>

            {this.banner(urls)}
          </Swiper>
          
          <ServiceType navigator={this.props.navigator} navComponent={this.props.navComponent}/>
       </ScrollView>
       
       </View>
       );

  }
}
const styles = StyleSheet.create({
  activeDot:{
  backgroundColor: '#fff',
  width: 8, 
  height: 8, 
  borderRadius: 4, 
  marginLeft: 3, 
  marginRight: 3, 
  marginTop: 3, 
  marginBottom: 3,
    },
  dot:{
    backgroundColor:'rgba(0,0,0,.2)', 
    width: 5, 
    height: 5,
    borderRadius: 4, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 3, 
    marginBottom: 3,
  },
  wrapper: {
    flex:1,
    
  },
  slider: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  
  image: {
    height:160,
    width:width,
    resizeMode: Image.resizeMode.stretch,
  },
  scrollView:{
    flex:1,
    backgroundColor:'#f8f7f7',
  },
navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarButtonText: {
    color:'#fff',
  },
   tel:{
  marginTop:25,
  width:25,
  height:25,
  },
});





