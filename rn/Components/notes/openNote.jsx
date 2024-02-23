import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const OpenNote = ({note}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{note.title}</Text>
      <Text style={styles.text}>{note.desc}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    color: 'white',
  },

  heading: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },

  text: {
    marginTop: 30,
    fontSize: 14,
    color: '#111',
  },

  inputField: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: 15,
    borderRadius: 3,
  },
});

export default OpenNote;
