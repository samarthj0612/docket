import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import db from '../../database/db';
import {useUser} from '../../context/UserContext';

const Login = ({navigation}) => {
  const {setUser} = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isValid, setIsValid] = useState(false);
  const [isWrongCredentials, setIsWrongCredentials] = useState(false);

  const loginHandler = () => {
    if (!email || !password) {
      setIsWrongCredentials(false);
      setIsValid(true);
      return;
    }
    let data = {
      email: email,
      password: password,
    };
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND pwd = ?',
        [data.email, data.password],
        (_, result) => {
          if (result.rows.length) {
            console.log('Successfully logged in');
            setUser(result.rows.item(0));
            navigation.navigate('homestack');
          } else {
            setIsValid(false);
            setIsWrongCredentials(true);
          }
        },
        err => {
          console.error('Error file login user => ', err);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.inputField}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      {isValid && <Text style={styles.error}>All fields are mandatory*</Text>}
      {isWrongCredentials && (
        <Text style={styles.error}>Wrong credentials</Text>
      )}
      <Text style={styles.text1} onPress={() => navigation.navigate('signup')}>
        Don't have an account?
      </Text>
      <Text style={styles.loginBtn} onPress={loginHandler}>
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

  loginBtn: {
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

export default Login;
