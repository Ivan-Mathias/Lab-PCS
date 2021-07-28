import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from "react-native-paper";


export default function  DateTime() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  return (
    <View>
      <View>
        <Button children="" color="#909090" onPress={() => {setShow(true)}}/>
        <Text style={{position: 'absolute'}}>{date.getDate()}/{date.getMonth()}/{date.getUTCFullYear()}</Text>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange = {(event, selectedDate) => { const currentDate = selectedDate || date; setDate(currentDate); setShow(false)}}
        />
      )}
    </View>
  );
}