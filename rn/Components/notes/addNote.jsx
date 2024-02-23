import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import db from '../../database/db';
import {useUser} from '../../context/UserContext';

const AddNote = ({setIsAddNoteForm}) => {
  const {user} = useUser();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const [isValid, setIsValid] = useState(false);

  const addNoteHandler = () => {
    if (!title) {
      setIsValid(!isValid);
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO notes (title, desc, user_id) VALUES (?, ?, ?)',
        [title, desc, user.id],
        (_, result) => {
          setIsAddNoteForm(oldState => !oldState);
          console.log('Note successfully added => ');
        },
      );
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AddNote</Text>
      <TextInput
        value={title}
        style={styles.inputField}
        placeholder="Enter the note title here"
        onChangeText={setTitle}
      />
      <TextInput
        multiline={true}
        numberOfLines={8}
        value={desc}
        style={styles.inputField}
        placeholder="Write here . . . "
        onChangeText={setDesc}
      />
      {isValid && <Text style={styles.error}>All fields are mandatory*</Text>}
      <Text style={styles.submitBtn} onPress={addNoteHandler}>
        Add
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    color: 'white',
    alignItems: 'center',
  },

  heading: {color: 'white', fontSize: 20},

  inputField: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: 15,
    borderRadius: 3,
  },

  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 12,
  },

  submitBtn: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: '100',
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 2,
  },
});

export default AddNote;
