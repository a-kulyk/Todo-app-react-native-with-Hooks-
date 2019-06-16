import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useStateValue } from './state/StateContext';
import { ADD_TODO, EDIT_TODO } from './constants';
import { FAB } from 'react-native-paper';
import CreateTodo from './components/CreateTodo';
import TodoCard from './components/TodoCard';

export default function TodoList({ getFilteredTodos }) {
  const [{ todos }, dispatch] = useStateValue();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showItemMenu, setShowItemMenu] = useState(false);

  function toggleModal() {
    setModalVisible(!modalVisible);
  }

  function addTodo(newTodo) {
    dispatch({
      type: ADD_TODO,
      todo: { id: uuid(), ...newTodo },
    });
    toggleModal();
  }

  function openEditing(todoItem) {
    setItemToEdit(todoItem);
    toggleModal();
    setShowItemMenu(false);
  }

  function editTodo(todo) {
    dispatch({
      type: EDIT_TODO,
      todo,
    });

    setItemToEdit(null);
    toggleModal();
  }

  return (
    <View style={styles.container}>
      {todos.length === 0 ? <Text style={styles.noItems}>No items to show</Text> : null}

      <ScrollView style={styles.container}>
        {getFilteredTodos(todos).map(item => (
          <TodoCard
            key={item.id}
            item={item}
            openEditing={openEditing}
            showItemMenu={showItemMenu}
            setShowItemMenu={setShowItemMenu}
          />
        ))}
      </ScrollView>
      {modalVisible && (
        <CreateTodo
          toggleModal={toggleModal}
          modalVisible={modalVisible}
          addTodo={addTodo}
          editTodo={editTodo}
          itemToEdit={itemToEdit}
        />
      )}
      <FAB style={styles.fab} icon="add" color="white" onPress={toggleModal} />
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
    right: 30,
    bottom: 15,
  },
});
