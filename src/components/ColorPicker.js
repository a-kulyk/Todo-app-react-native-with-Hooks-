import React, { useState, Fragment } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RED, GREEN, YELLOW, PURPLE, BLUE } from '../constants';

export default function ColorPicker({ onSelect, selectedColor }) {
  const [selected, setSelected] = useState(selectedColor || RED);

  const choose = color => {
    setSelected(color);
    onSelect(color);
  };

  const palette = [RED, GREEN, YELLOW, PURPLE, BLUE];

  return (
    <Fragment>
      {palette.map(color => (
        <TouchableOpacity
          onPress={() => choose(color)}
          style={[styles.item, { backgroundColor: color }]}
          key={color}
        >
          {selected === color && <Icon name="check" size={15} color="white" />}
        </TouchableOpacity>
      ))}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
