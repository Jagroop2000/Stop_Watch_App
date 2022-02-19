import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { CSVDownload} from "react-csv";
import Toast from 'react-native-simple-toast';
import { Picker } from "@react-native-picker/picker";
import { min } from "moment";
const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    borderWidth: 2,
    borderColor: "#89AAFF",
    width: screen.width*0.4,
    height: screen.width*0.1,
    borderRadius: screen.width*0.02,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginLeft : 10,
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 20,
    color: "#89AAFF"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  timerText: {
    color: "green",
    fontSize: 90
  },
  picker: {
    width: 120,
    ...Platform.select({
      android: {
        color: "red", 
        backgroundColor: "white",
        marginLeft: 10,
      }
    })
  },
  pickerItem: {
    color: "black",
    fontSize: 20,
    marginTop: 16,
    marginLeft : 4

  },
  pickerContainer: {
    flexDirection: "column",

    
  }
});


const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  const miliseconds = seconds*1000;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) , miliseconds: formatNumber(miliseconds) };
};

const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(60);
const AVAILABLE_SECONDS = createArray(60);
const AVAILABLE_MILISECONDS = createArray(60);

export default class TimerScreen extends React.Component {
  state = {
    remainingSeconds: 5,
    remainingMiliSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "0",
    selectedMiliSeconds: "0",
    lapArray : [],
    sno : [] ,
    lapOrStop:"",
    isStarted :false,
    onPauseMinutes : "0",
    onPauseSeconds: "0",
    isPaused: false,
    saveEntries : [], 
    isChecked : false,
  };

  interval = null;

  componentDidUpdate(prevProp, prevState) {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onLapClear = () => {
    this.setState({
      lapArray: []
    });
  };
  onLap = () => {
   
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    console.log("MINUTES AND SECONDS--->" , minutes , seconds);
    let res = minutes + " : " + seconds + "         " + "LAP";
    this.state.isStarted === false? (
      alert("Please Start  Timer")
    ): (
    this.state.lapArray.push(res)
    )
  };
  
  handleMinute = (text) => {
    this.setState({
      selectedMinutes: text
    });
  };
  
  handleSeconds = (text1) => {
    this.setState({
      selectedSeconds: text1
    });
  };

  downloadCVS = () => {
    return(
      this.state.lapArray.length === 0 ? (
        alert("No Lap Available")
      ) : (
       
<CSVDownload data={this.state.lapArray} target="_blank" /> ,
 Toast.show('Successfully Downloaded !!')


      )
    );
  }
 
  start = () => {
   
    let res = this.state.selectedMinutes + " : " + this.state.selectedSeconds + "      " + " START";
    this.state.lapArray.push(res);
    this.setState(state => ({
      remainingSeconds:
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10) ,
      isRunning: true,
      isStarted : true,
      isPaused : false
    }));

    this.interval = setInterval(() => {
      this.setState(state => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 2000);
  };
 


  stop = () => {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    let res = minutes + " : " + seconds + "      " + " STOP";
   ( minutes === "00" &&  seconds==="00" ) ||  ( minutes === "00" &&  seconds==="05" )?(
      console.log("Nothing to Reset")
    ):(
    this.state.lapArray.push(res));
    clearInterval(this.interval);
   this.interval = null;
    this.setState({
      remainingSeconds: 0, // temporary
      isRunning: false,
      isStarted : false,

    });
  };

 onPause = async() => {

  const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
  let res = minutes + " : " + seconds + "      " + " PAUSE";
  minutes === "00" &&  seconds==="00"?(
    console.log("Time Reset")
  ):(
  this.state.lapArray.push(res));

  this.setState({
   selectedMinutes: minutes,
   selectedSeconds: seconds,
   onPauseMinutes : minutes,
   onPauseSeconds : seconds,
   isPaused : true,
   isStarted : false,
   
  });
  

  }

  
  saveEntry = () => {
    console.log("Save Entry Function is Working");
    this.setState({
        onPauseMinutes : this.state.selectedMinutes,
        onPauseSeconds : this.state.selectedSeconds
    })
     let res = this.state.onPauseMinutes + ":"  +this.state.onPauseSeconds;
    this.state.onPauseMinutes == "0" && this.state.onPauseSeconds == "0"?
    (
     alert("Please Set Atleast Minutes or Seconds")      
    ) :
    (
    
    
      this.state.saveEntries.push(res),
      Toast.show('Successfully Saved !!'),
      console.log("Entries -->" , this.state.saveEntries)
     )

  }

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <View style={{flexDirection: "row"}}>
        <View style={{borderWidth: 2 , borderRadius : 8 , borderColor :"#D5DBDB"}}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={itemValue => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      </View>
      <Text style={styles.pickerItem}>Minutes</Text>
      </View>
      <View style={{flexDirection: "row" ,}}>
      <View style={{borderWidth: 2 , borderRadius : 8 ,borderColor :"#D5DBDB"}}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={itemValue => {
          this.setState({ selectedSeconds: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} /> 
        ))}
      </Picker>
      </View>
      <Text style={styles.pickerItem}>Seconds</Text>
      </View>
      {/* <View style={{flexDirection: "row" ,}}> */}
      {/* <View style={{borderWidth: 2 , borderRadius : 8 ,borderColor :"#D5DBDB"}}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMiliSeconds}
        onValueChange={itemValue => {
          this.setState({ selectedMiliSeconds: itemValue });
        }}
        mode="dropdown"
      >
        {AVAILABLE_MILISECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} /> 
        ))}
      </Picker>
      </View>
      <Text style={styles.pickerItem}>Mili-Seconds</Text>
      </View> */}
    </View>
  );

  render() {
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
 
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={{ fontSize : 24 , marginTop : 10 , marginLeft : 20 , color : "purple", fontWeight : "bold"}}>Set your default time here :</Text>
        <View  style={{ flexDirection : "row" , padding : 10}}>
        <View
           style={{ 
             marginLeft: 10,
             borderWidth: 2,
             height: screen.height*0.06,
             width: screen.width*0.2,
             borderColor :"#D5DBDB",
             borderRadius: 6,
           }}
         >
           <TextInput
             style={{  color: "#9a73ef" }}
             placeholder="00"
             keyboardType = 'numeric'
             placeholderTextColor="#9a73ef"
             onChangeText={this.handleMinute}
           />
           </View>
           <Text style={{
              color: "black",
              fontSize: 20,
              marginTop : 8,
              marginLeft : 4
           }}>Minutes</Text>

            <View
           style={{
             marginLeft: 10,
             borderWidth: 2,
             height: screen.height*0.06,
             width: screen.width*0.2,
             borderColor :"#D5DBDB",
             borderRadius: 6,
             
           }}
         >
           <TextInput
             style={{  color: "#9a73ef" }}
             placeholder="00"
             keyboardType = 'numeric'
             placeholderTextColor="#9a73ef"
             onChangeText={this.handleSeconds}
           />
           </View>
           <Text style={{
              color: "black",
              fontSize: 20,
              marginTop : 8,
              marginLeft : 4 
           }}>Seconds</Text>

           </View>
           <View style={{justifyContent : "center" , alignItems:"center"}}>
           <TouchableOpacity onPress={this.saveEntry} style={styles.button}>
         <Text style={styles.buttonText}>Save Entry</Text>
       </TouchableOpacity> 
       </View>  
           <Text style={{ fontSize : 24 , marginTop : 10 , marginLeft : 20 , marginBottom : 10,color : "purple", fontWeight : "bold"}}>Select Time Here:</Text>

        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          this.state.isPaused? (
            <View style={{alignItems:"center"}}>
            <Text style={styles.timerText}>{this.state.onPauseMinutes}:{this.state.onPauseSeconds}</Text>
            </View>
          ):(
          <View style={{alignItems:"center"}}>
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
          </View>
          )
        ) : (
          this.renderPickers()
        )}
        <View  style={{flexDirection : "row"}}>
        {this.state.isStarted ? (
          <TouchableOpacity
            onPress={this.onPause}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Pause</Text>
          </TouchableOpacity> 
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}

<TouchableOpacity onPress={this.onLap} style={styles.button}>
         <Text style={styles.buttonText}>Lap</Text>
       </TouchableOpacity>
       </View>
       <View  style={{flexDirection : "row"}}>
       <TouchableOpacity onPress={this.onLapClear} style={styles.button}>
         <Text style={styles.buttonText}>Clear</Text>
       </TouchableOpacity> 
       <TouchableOpacity onPress={this.downloadCVS} style={styles.button}>
         <Text style={styles.buttonText}>Download Lap</Text>
       </TouchableOpacity> 
       </View> 
       <View  style={{flexDirection : "row"}}>
       <TouchableOpacity onPress={this.stop} style={styles.button}>
         <Text style={styles.buttonText}>Reset Counter</Text>
       </TouchableOpacity> 

       <TouchableOpacity onPress={
           ()=>{
               this.props.navigation.navigate("PreviousEntries" , {entries : this.state.saveEntries});
           }
       } style={styles.button}>
         <Text style={styles.buttonText}>Saved Entries</Text>
       </TouchableOpacity> 
       </View>

       <FlatList    style={{marginTop: 10}}
                    data={this.state.lapArray}
                    legacyImplementation={true}
                    renderItem={({item, index}) => <Text key={index+1} style={{fontSize : 20 , color :"black"}}>{`#${index}            `}{item} </Text>}
                />

{/* <View style={{flexDirection : "column"}}>
             <Text style={{ fontSize : 24 , marginTop : 10 , marginLeft : 20 , color : "purple", fontWeight : "bold"}}>Your Previous Entries :</Text>
             <FlatList    style={{marginTop: 10 , flex: 1}}
                    data={this.state.saveEntries}
                    legacyImplementation={true}
                    renderItem={({item, index}) => <Text key={index+1} style={{fontSize : 20 , color :"black"}}>{`#${index}            `}{item} </Text>}
                />
           </View> */}
       </ScrollView>
      </View>
    );  
  }
}  