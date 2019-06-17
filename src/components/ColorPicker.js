import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { PALETTE, RED } from '../constants';

export default function ColorPicker({ onSelect, selectedColor }) {
  const [selected, setSelected] = useState(RED);

  useEffect(() => {
    if (selectedColor) {
      setSelected(selectedColor);
    }
  }, [selectedColor]);

  const choose = color => {
    setSelected(color);
    onSelect(color);
  };

  return (
    <Fragment>
      {PALETTE.map(color => (
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
    elevation: 4,
  },
});
