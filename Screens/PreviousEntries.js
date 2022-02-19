import React from "react";
import { View, StyleSheet, Text , FlatList , Image, TouchableOpacity } from "react-native";

export default class  PreviousEntries  extends React.Component  {
 

render(){
    const  {entries} = this.props.route.params;
    console.log(entries);
  return (
      
    <View style={styles.container}>
      <View style={{flexDirection : "row"}}>
          <TouchableOpacity
          onPress={()=> { this.props.navigation.goBack()}}
          >
          <Image 
           source={require("../Images/arrow.png")}
           style={{marginTop : 5 , marginLeft: 5 }}
          />
          </TouchableOpacity>
             <Text style={{ fontSize : 24 , marginTop : 10 , marginLeft : 20 , color : "purple", fontWeight : "bold"}}>Your Previous Entries :</Text>
             </View>
             <FlatList    style={{marginTop: 10 , flex: 1}}
                    data={entries}
                    legacyImplementation={true}
                    renderItem={({item, index}) => <Text key={index+1} style={{fontSize : 20 , color :"black"}}>{`#${index}            `}{item} </Text>}
                />
          
    </View>
  );
};
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
       
      },
});

