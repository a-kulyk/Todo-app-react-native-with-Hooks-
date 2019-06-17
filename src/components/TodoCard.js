import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Menu, IconButton } from 'react-native-paper';
import { COMPLETE_TODO, REMOVE_TODO, SET_ITEM_TO_EDIT } from '../constants';
import { useStateValue } from '../state/StateContext';

export default function TodoCard({ item, openEditing, showItemMenu, setShowItemMenu }) {
  const { dispatch } = useStateValue();

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: item.color, borderLeftWidth: 8 },
        item.completed ? { opacity: 0.7 } : {},
      ]}
    >
      <TouchableOpacity
        onPress={() => dispatch({ type: COMPLETE_TODO, id: item.id })}
        style={styles.icon}
      >
        {item.completed ? <Icon name="check-square" size={20} /> : <Icon name="square" size={20} />}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.header, item.completed ? styles.completed : {}]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View>{item.date ? <Text style={styles.date}>Deadline: {item.date}</Text> : null}</View>
      </View>
      {item.photoSource && (
        <Image source={item.photoSource} style={styles.photo} resizeMode="cover" />
      )}
      <Menu
        visible={showItemMenu === item.id}
        onDismiss={() => setShowItemMenu(false)}
        anchor={
          <IconButton
            icon="more-vert"
            style={{ margin: 0 }}
            size={20}
            onPress={() => setShowItemMenu(item.id)}
          />
        }
      >
        <Menu.Item
          style={styles.menuItem}
          onPress={() => {
            dispatch({ type: SET_ITEM_TO_EDIT, itemToEdit: item });
            openEditing();
          }}
          title="Edit"
        />
        <Menu.Item
          style={styles.menuItem}
          onPress={() => {
            dispatch({ type: REMOVE_TODO, id: item.id });
          }}
          title="Delete"
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 8,
    padding: 6,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    padding: 8,
    marginRight: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#4b4b4b',
    marginBottom: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  description: {
    color: '#4b4b4b',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  photo: {
    borderRadius: 5,
    height: 80,
    width: 80,
  },
  menuItem: {
    minWidth: 0,
    width: 80,
    padding: 0,
  },
});
