import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useStateValue } from './state/StateContext';
import { SET_ITEM_TO_EDIT } from './constants';
import Icon from 'react-native-vector-icons/Feather';
import CreateTodo from './components/CreateTodo';
import TodoCard from './components/TodoCard';

export default function TodoList({ getFilteredTodos }) {
  const {
    appState: { todos, itemToEdit },
    dispatch,
  } = useStateValue();
  const [modalVisible, setModalVisible] = useState(false);
  const [showItemMenu, setShowItemMenu] = useState(false);

  function toggleModal() {
    if (itemToEdit && modalVisible) {
      dispatch({ type: SET_ITEM_TO_EDIT, itemToEdit: null });
    }
    setModalVisible(!modalVisible);
  }

  function openEditing(todoItem) {
    toggleModal();
    setShowItemMenu(false);
  }

  return (
    <View style={styles.container}>
      {todos.length === 0 ? <Text style={styles.noItems}>No items to show</Text> : null}

      <ScrollView>
        <View style={{ paddingBottom: 50 }}>
          {getFilteredTodos(todos).map(item => (
            <TodoCard
              key={item.id}
              item={item}
              openEditing={openEditing}
              showItemMenu={showItemMenu}
              setShowItemMenu={setShowItemMenu}
            />
          ))}
        </View>
      </ScrollView>

      {modalVisible && <CreateTodo toggleModal={toggleModal} />}

      <TouchableOpacity style={styles.fab} onPress={toggleModal} activeOpacity={0.7}>
        <Icon name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    width: '100%',
    flex: 1,
  },
  noItems: {
    marginTop: 100,
    alignSelf: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#4b4b4b',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#2980B9',
    right: 15,
    bottom: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
