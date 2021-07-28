import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from "react-native-paper";

export type DateTimeProps = {
    event : Event,
    selectedDate? : Date | undefined
}

export default function  DateTime() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  return (
    <View>
      <View style={{justifyContent: 'center'}}>
        <Button children="" color="#909090" onPress={() => {setShow(true)}}/>
        <Text style={{position: 'absolute', marginLeft: 10}}>{date.getDate()}/{date.getMonth()+1}/{date.getUTCFullYear()}</Text>
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