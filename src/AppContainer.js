import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { StateProvider } from './state/StateContext';
import TodoList from './TodoList';
import ColorPicker from './components/ColorPicker';
import { RED, BLUE, ALL, IN_PROGRESS, COMPLETED, OVERDUE, COLOR, DATE_FORMAT } from './constants';

export default function AppContainer() {
  const [initialState, setInitialState] = useState(null);
  const [filter, setActiveFilter] = useState(IN_PROGRESS);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(RED);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const value = await AsyncStorage.getItem('todoItems');

      if (value !== null) {
        setInitialState({ todos: JSON.parse(value) });
      } else {
        setInitialState({ todos: [] });
      }
    } catch (e) {
      console.log({ catchOnGetting: e });
    }
  }

  function getFilteredTodos(todos) {
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
    if (showColorPicker) {
      setShowColorPicker(false);
    }
  };

  const openColorPicker = () => {
    // if (!todos.includes(todo => todo.color === selectedColor)) {
    // }
    setShowColorPicker(true);
    setFilter(COLOR);
  };

  if (!initialState) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size={50} color={BLUE} />
      </View>
    );
  }

  return (
    <StateProvider initialState={initialState}>
      <View style={styles.container}>
        <TodoList getFilteredTodos={getFilteredTodos} />

        {showColorPicker && (
          <View style={styles.colorPicker}>
            <ColorPicker onSelect={setSelectedColor} selectedColor={selectedColor} />
          </View>
        )}
        <View style={styles.filter}>
          {[ALL, IN_PROGRESS, COMPLETED, OVERDUE, COLOR].map((filterable, idx) => (
            <TouchableOpacity
              activeOpacity={0.8}
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
    </StateProvider>
  );
}

const styles = StyleSheet.create({
  preloader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
  },

  filter: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: BLUE,
  },

  colorPicker: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 5,
    bottom: 55,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 1,
  },
});
