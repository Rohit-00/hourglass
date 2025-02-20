import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import AntDesign from '@expo/vector-icons/AntDesign';


const Table = ({heading,list}:TableProps) => {
  return (
    <View style={styles.container}>
        <View style={styles.headingContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <TouchableOpacity>
                <AntDesign name="pluscircle" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
        <View>
            {
                list.map((item,index)=>(
                    <View>
                    <View key={index} style={styles.table}>
                        <Text style={{color:colors.text}}>{item.title}</Text>
                        <Text style={{color:colors.text}}>{item.time}</Text>
                   
                    </View>
                    <View style={{borderBottomColor:colors.border,borderBottomWidth:0.5,marginTop:5}}/>
                     </View>
                ))
            }
        </View>
    </View>
  )
}

export default Table

const styles = StyleSheet.create({
     container: {
        padding:20,
        width:'100%',
        marginTop:10,
        backgroundColor:colors.background,
        borderRadius:10,
        borderColor:colors.border,
        borderWidth:0.5,
   
      },
      headingContainer:{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
      },
      heading:{
            fontSize:18,
            color:colors.text,
            marginBottom:10
      },
      table:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10
    }
})