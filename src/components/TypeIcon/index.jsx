import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native'
import { Image } from 'react-native'
import { View } from 'react-native'

export default function TypeIcon({ title, image, onPress, color }) {

  return (
    <TouchableOpacity>
      <View onTouchEndCapture={onPress} style={{ marginHorizontal: 10, alignItems: 'center' }}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
            backgroundColor: color
          }}
        >
          <Image source={image} style={{ width: 60, height: 60 }} />
        </View>
        <Text style={{ textTransform: 'uppercase' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}
