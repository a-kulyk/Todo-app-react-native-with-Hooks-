import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import TodoList from './TodoList';
import { BLUE, ALL, IN_PROGRESS, COMPLETED, OVERDUE, DATE_FORMAT } from './constants';

export const TodoContext = React.createContext();

export default function AppContainer() {
  const [todos, setTodo] = useState([]);
  const [filter, setFilter] = useState(ALL);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    async function storeData() {
      try {
        await AsyncStorage.setItem('todoItems', JSON.stringify(todos));
      } catch (e) {
        console.log({ catchOnStoring: e.Error });
      }
    }

    storeData();
  }, [todos]);

  async function getData() {
    try {
      const value = await AsyncStorage.getItem('todoItems');

      if (value !== null) {
        setTodo(JSON.parse(value));
      }
    } catch (e) {
      setTodo(null);
    }
  }

  function getFilteredTodos() {
    switch (filter) {
      case ALL:
        return todos;
      case IN_PROGRESS:
        return todos.filter(item => !item.completed);
      case COMPLETED:
        return todos.filter(item => item.completed);
      case OVERDUE:
        return todos.filter(item => {
          const dueDate = moment(item.date, DATE_FORMAT);

          return moment().isAfter(dueDate, 'day');
        });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.filter}>
        <TouchableOpacity onPress={() => setFilter(ALL)}>
          <Text
            style={[
              styles.tabItem,
              filter === ALL ? { backgroundColor: BLUE, color: 'white' } : { color: BLUE },
            ]}
          >
            All Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter(IN_PROGRESS)}>
          <Text style={[styles.tabItem, filter === IN_PROGRESS ? styles.activeTab : {}]}>
            In progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter(COMPLETED)}>
          <Text style={[styles.tabItem, filter === COMPLETED ? styles.activeTab : {}]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter(OVERDUE)}>
          <Text style={[styles.tabItem, filter === OVERDUE ? styles.activeTab : {}]}>Overdue</Text>
        </TouchableOpacity>
      </View>

      <TodoContext.Provider value={{ todos, setTodo, getFilteredTodos }}>
        <TodoList />
      </TodoContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  filter: {
    flexDirection: 'row',
    flexBasis: 50,
  },
  tabItem: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 10,
    color: BLUE,
  },

  activeTab: {
    backgroundColor: BLUE,
    color: 'white',
  },
});
