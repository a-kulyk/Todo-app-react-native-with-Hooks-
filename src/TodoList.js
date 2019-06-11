import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { TodoContext } from './AppContainer';
import Icon from 'react-native-vector-icons/Feather';
import uuid from 'uuid/v4';
import { Menu, FAB, IconButton } from 'react-native-paper';
import CreateTodo from './components/CreateTodo';

export default function TodoList() {
  const { todos, setTodo, getFilteredTodos } = useContext(TodoContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

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
    setShowMenu(false);
  }
  function edit(id) {
    const itemToEdit = todos.find(todo => todo.id === id);
    setItemToEdit(itemToEdit);
    toggleModal();
    setShowMenu(false);
  }
  function editTodo(todo) {
    const updatedList = todos.map(item => (item.id === todo.id ? todo : item));

    setItemToEdit(null);

    setTodo(updatedList);

    toggleModal();
  }

  return (
    <View style={styles.container}>
      {
        <View>
          {todos.length === 0 ? <Text style={styles.noItems}>No items to show</Text> : null}
        </View>
      }
      <ScrollView style={styles.container}>
        {getFilteredTodos().map(item => (
          <View
            style={[
              styles.card,
              { borderLeftColor: item.color, borderLeftWidth: 8 },
              item.completed ? { opacity: 0.7 } : {},
            ]}
            key={item.id}
          >
            <TouchableOpacity onPress={() => complete(item.id)} style={styles.icon}>
              {item.completed ? (
                <Icon name="check-square" size={20} />
              ) : (
                <Icon name="square" size={20} />
              )}
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={[styles.header, item.completed ? styles.completed : {}]}>
                {item.title}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <View>
                {item.date ? <Text style={styles.date}>Deadline: {item.date}</Text> : null}
              </View>
            </View>
            <View>
              {item.photoSource && (
                <Image source={item.photoSource} style={styles.photo} resizeMode="cover" />
              )}
            </View>
            <View>
              <Menu
                visible={showMenu === item.id}
                onDismiss={() => setShowMenu(false)}
                anchor={
                  <IconButton icon="more-vert" size={20} onPress={() => setShowMenu(item.id)} />
                }
              >
                <Menu.Item
                  style={styles.menuItem}
                  onPress={() => {
                    edit(item.id);
                  }}
                  title="Edit"
                />
                <Menu.Item
                  style={styles.menuItem}
                  onPress={() => {
                    deleteItem(item.id);
                  }}
                  title="Delete"
                />
              </Menu>
            </View>
          </View>
        ))}
      </ScrollView>
      <CreateTodo
        toggleModal={toggleModal}
        modalVisible={modalVisible}
        addTodo={addTodo}
        editTodo={editTodo}
        itemToEdit={itemToEdit}
      />
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
  fab: {
    position: 'absolute',
    backgroundColor: '#2980B9',
    right: 30,
    bottom: 30,
  },
});
