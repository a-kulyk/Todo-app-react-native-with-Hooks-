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
import { ADD_TODO, EDIT_TODO, RED, BLUE, DATE_FORMAT } from '../constants';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';

export default function CreateTodo({ toggleModal }) {
  const {
    appState: { itemToEdit },
    dispatch,
  } = useStateValue();
  const initialState = {
    title: '',
    description: '',
    date: '',
    photoSource: null,
    color: RED,
    invalidFields: [],
  };
  const [formState, setFormState] = useState({ ...initialState });

  useEffect(() => {
    if (itemToEdit) {
      setFormState({ ...initialState, ...itemToEdit });
    }
  }, [itemToEdit]);

  function save() {
    let invalid = [];
    if (formState.title.trim() === '') {
      invalid.push('title');
    }
    if (formState.description.trim() === '') {
      invalid.push('description');
    }

    if (invalid.length > 0) {
      setFormState({ ...formState, invalidFields: invalid });
      return;
    }

    const { invalidFields, ...omitInvalids } = formState;
    const item = { ...omitInvalids, completed: false };

    if (itemToEdit) {
      dispatch({
        type: EDIT_TODO,
        todo: item,
      });
    } else {
      dispatch({
        type: ADD_TODO,
        todo: { id: uuid(), ...item },
      });
    }

    toggleModal();
  }

  function isInvalid(field) {
    return formState.invalidFields.includes(field);
  }

  function onRequiredChange(fieldValue, fieldName) {
    if (isInvalid(fieldName)) {
      const updatedInvalidFields = formState.invalidFields.filter(i => i !== fieldName);
      setFormState({ ...formState, invalidFields: updatedInvalidFields });
      return;
    }

    setFormState({ ...formState, [fieldName]: fieldValue });
  }

  function renderDatePicker() {
    return (
      <DatePicker
        style={styles.date}
        showIcon={false}
        date={formState.date}
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
        onDateChange={date => setFormState({ ...formState, date })}
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

        setFormState({ ...formState, photoSource: source });
      }
    });
  }

  function renderImagePicker() {
    const { photoSource } = formState;
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
          <TouchableOpacity onPress={() => setFormState({ ...formState, photoSource: null })}>
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
      visible={true}
      onRequestClose={toggleModal}
      style={{ margin: 20 }}
    >
      <View style={styles.wrapper}>
        <View>
          <TextInput
            value={formState.title}
            placeholder="Title"
            onChangeText={value => onRequiredChange(value, 'title')}
            style={[styles.input, isInvalid('title') ? styles.invalid : {}]}
          />

          <TextInput
            value={formState.description}
            placeholder="Description"
            onChangeText={value => onRequiredChange(value, 'description')}
            multiline={true}
            style={[styles.textArea, isInvalid('description') ? styles.invalid : {}]}
          />

          {renderDatePicker()}

          {renderImagePicker()}

          <View style={{ marginBottom: 50 }}>
            <Text style={{ paddingBottom: 15 }}>Add color tag:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <ColorPicker
                onSelect={color => setFormState({ ...formState, color })}
                selectedColor={formState.color}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.button, { backgroundColor: 'white' }]}
            onPress={toggleModal}
          >
            <Text style={[styles.btnText, { color: '#4b4b4b' }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={save}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
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

  invalid: {
    borderColor: RED,
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

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  button: {
    width: 100,
    height: 40,
    marginLeft: 10,
    backgroundColor: BLUE,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  btnText: {
    color: 'white',
    fontSize: 16,
  },
});
