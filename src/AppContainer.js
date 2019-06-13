import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import TodoList from './TodoList';
import ColorPicker from './components/ColorPicker';
import { BLUE, ALL, IN_PROGRESS, COMPLETED, OVERDUE, COLOR, DATE_FORMAT } from './constants';

export const TodoContext = React.createContext();

export default function AppContainer() {
  const [todos, setTodo] = useState([]);
  const [filter, setActiveFilter] = useState(ALL);
  const [showColors, setShowColors] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

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
      console.log({ catchOnGetting: e });
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
      case COLOR:
        return todos.filter(item => item.color === selectedColor);
      default:
        return todos;
    }
  }

  const setFilter = filter => {
    setActiveFilter(filter);
    if (showColors) {
      setShowColors(false);
    }
  };

  const openColorPicker = () => {
    setShowColors(true);
    setFilter(COLOR);
  };

  return (
    <View style={styles.container}>
      <TodoContext.Provider value={{ todos, setTodo, getFilteredTodos }}>
        <TodoList />
      </TodoContext.Provider>

      {showColors && (
        <View style={styles.colorPicker}>
          <ColorPicker onSelect={setSelectedColor} selectedColor={selectedColor} />
        </View>
      )}
      <View style={styles.filter}>
        {[ALL, IN_PROGRESS, COMPLETED, OVERDUE, COLOR].map((filterable, idx) => (
          <TouchableOpacity
            onPress={() => {
              filterable === COLOR ? openColorPicker() : setFilter(filterable);
            }}
            style={[styles.tabItem, filter === filterable ? styles.activeTab : {}]}
            key={idx}
          >
            <Text style={filter === filterable ? { color: 'white' } : { color: BLUE }}>
              {filterable}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    height: 30,
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },

  activeTab: {
    backgroundColor: BLUE,
  },

  colorPicker: {
    flexDirection: 'row',
  },
});
