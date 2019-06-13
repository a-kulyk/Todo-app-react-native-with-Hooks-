import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TodoContext } from './AppContainer';
import uuid from 'uuid/v4';
import { FAB } from 'react-native-paper';
import CreateTodo from './components/CreateTodo';
import TodoCard from './components/TodoCard';

export default function TodoList() {
  const { todos, setTodo, getFilteredTodos } = useContext(TodoContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showItemMenu, setShowItemMenu] = useState(false);

  function toggleModal() {
    setModalVisible(!modalVisible);
  }

  function addTodo(newTodo) {
    setTodo([...todos, { id: uuid(), ...newTodo }]);
    toggleModal();
  }

  function complete(id) {
    const editedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodo(editedTodos);
  }

  function deleteItem(id) {
    const updatedList = todos.filter(todo => todo.id !== id);

    setTodo(updatedList);
    setShowItemMenu(false);
  }

  function editItem(id) {
    const itemToEdit = todos.find(todo => todo.id === id);

    setItemToEdit(itemToEdit);
    toggleModal();
    setShowItemMenu(false);
  }

  function editTodo(todo) {
    const updatedList = todos.map(item => (item.id === todo.id ? todo : item));

    setItemToEdit(null);
    setTodo(updatedList);
    toggleModal();
  }

  return (
    <View style={styles.container}>
      {todos.length === 0 ? <Text style={styles.noItems}>No items to show</Text> : null}

      <ScrollView style={styles.container}>
        {getFilteredTodos().map(item => (
          <TodoCard
            key={item.id}
            item={item}
            complete={complete}
            deleteItem={deleteItem}
            edit={editItem}
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
