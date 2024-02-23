import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import db from '../../database/db';

const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const [isValid, setIsValid] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, admin BOOLEAN DEFAULT 0, name TEXT, email TEXT UNIQUE, mob TEXT, pwd TEXT)',
        [],
        (_, result) => {
          console.log('Users Table successfully created');
        },
        err => {
          console.error('Error while creating table: ', err);
        },
      );
    });
  }, []);

  const signupHandler = () => {
    if (!name || !email || !mobile || !password) {
      setIsUserRegistered(false);
      setIsValid(true);
      return;
    }
    let data = {
      name: name,
      email: email,
      mobile: mobile,
      password: password,
    };

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ?',
        [data.email],
        (_, res) => {
          if (res.rows.length) {
            console.log('User already registered');
            setIsValid(false);
            setIsUserRegistered(true);
          } else {
            tx.executeSql(
              'INSERT INTO users (name, email, mob, pwd) VALUES (?, ?, ?, ?)',
              [data.name, data.email, data.mobile, data.password],
              (__, result) => {
                console.log('Data insertion in db');
                console.log('User successfully registered');
                navigation.navigate('login');
              },
              err => {
                console.error('Error while insertion data: ', err);
              },
            );
          }
        },
        err => {
          console.error('Error while checking user existence', err);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Signup</Text>
      <TextInput
        style={styles.inputField}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <TextInput
        style={styles.inputField}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        value={mobile}
        onChangeText={setMobile}
        placeholder="Enter your mobile"
      />
      <TextInput
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      {isValid && <Text style={styles.error}>All fields are mandatory*</Text>}
      {isUserRegistered && (
        <Text style={styles.error}>Given email is already registered</Text>
      )}
      <Text style={styles.text1} onPress={() => navigation.navigate('login')}>
        Already have an account?
      </Text>
      <Text style={styles.signupBtn} onPress={signupHandler}>
        Next
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 12},

  heading: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 35,
    marginVertical: 20,
  },

  inputField: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 6,
    marginVertical: 10,
    paddingHorizontal: 16,
  },

  error: {
    fontSize: 12,
    color: 'red',
  },

  text1: {
    color: 'blue',
    textAlign: 'right',
  },

  signupBtn: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    color: 'white',
    marginTop: 30,
    paddingVertical: 8,
    paddingHorizontal: 35,
  },
});

export default Signup;
