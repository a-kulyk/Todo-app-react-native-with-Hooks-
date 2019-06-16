import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid/v4';
import ColorPicker from './ColorPicker';
import { useStateValue } from '../state/StateContext';
import { Button } from 'react-native-paper';
import { ADD_TODO, RED, BLUE, DATE_FORMAT } from '../constants';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';

export default function CreateTodo({ modalVisible, toggleModal, editTodo, itemToEdit }) {
  const [{ todos }, dispatch] = useStateValue();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [photoSource, setPhotoSource] = useState(null);
  const [color, setColor] = useState(RED);

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setDescription(itemToEdit.description);
      setDate(itemToEdit.date);
      setPhotoSource(itemToEdit.photoSource);
      setColor(itemToEdit.color);
    }
  }, [itemToEdit, modalVisible]);

  function save() {
    if (title.trim() === '' || description.trim() === '') {
      return;
    }

    const item = { title, description, date, photoSource, color, completed: false };

    if (itemToEdit) {
      editTodo({ id: itemToEdit.id, ...item });
      clearForm();
      return;
    }

    // addTodo(item);
    dispatch({
      type: 'ADD_TODO',
      todo: { id: uuid(), ...item },
    });
    closeForm();
  }

  function closeForm() {
    toggleModal();
    clearForm();
  }

  function clearForm() {
    setTitle('');
    setDescription('');
    setDate('');
    setPhotoSource(null);
    setColor(RED);
  }

  function renderDatePicker() {
    return (
      <DatePicker
        style={styles.date}
        showIcon={false}
        date={date}
        mode="date"
        placeholder="Due Date"
        format={DATE_FORMAT}
        minDate={moment().format(DATE_FORMAT)}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: 'flex-start',
          },
          placeholderText: {
            position: 'absolute',
            left: 4,
            color: '#A1A1A1',
          },
        }}
        onDateChange={date => {
          setDate(date);
        }}
      />
    );
  }

  function selectPhoto() {
    const options = {
      title: 'Add picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.uri) {
        const source = { uri: response.uri };

        setPhotoSource(source);
      }
    });
  }

  function renderImagePicker() {
    return (
      <View style={styles.photoWrapper}>
        <TouchableWithoutFeedback onPress={selectPhoto}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {photoSource === null ? (
              <Text>Add a Photo</Text>
            ) : (
              <Image style={styles.photo} source={photoSource} resizeMode="cover" />
            )}
          </View>
        </TouchableWithoutFeedback>
        {photoSource && (
          <TouchableOpacity onPress={() => setPhotoSource(null)}>
            <Icon name="x" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={toggleModal}
      style={{ margin: 20 }}
    >
      <View style={styles.wrapper}>
        <View>
          <TextInput
            value={title}
            placeholder="Title"
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            value={description}
            placeholder="Description"
            onChangeText={setDescription}
            multiline={true}
            style={styles.textArea}
          />

          {renderDatePicker()}

          {renderImagePicker()}

          <View style={{ marginBottom: 50 }}>
            <Text style={{ paddingBottom: 15 }}>Add color tag:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <ColorPicker onSelect={setColor} selectedColor={color} />
            </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button mode="outlined" onPress={closeForm} contentStyle={{ width: 150 }} color={BLUE}>
            Cancel
          </Button>
          <Button mode="contained" onPress={save} contentStyle={{ width: 150 }} color={BLUE}>
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },

  input: {
    color: '#4b4b4b',
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    width: '100%',
    marginBottom: 25,
  },

  textArea: {
    textAlignVertical: 'top',
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    marginBottom: 25,
  },

  date: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    marginBottom: 25,
  },

  closeButton: {
    transform: [{ rotate: '45deg' }],
    fontSize: 48,
    width: 48,
    height: 48,
  },

  photoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    marginBottom: 25,
  },

  photo: {
    borderRadius: 5,
    height: 120,
    width: 120,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
