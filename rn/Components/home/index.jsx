import {View, Text, StyleSheet, BackHandler, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {useUser} from '../../context/UserContext';

const Home = ({navigation}) => {
  const {user, setUser} = useUser();
  console.info({user});

  const logoutHandler = () => {
    setUser(null);
    console.log('Successfully logged out');
    navigation.navigate('login');
  };

  // Code to disable back behaviour of our phone
  /* useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {cancelable: false},
        );
        return true;
      },
    );
    return () => backHandler.remove();
  }, []); */

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Docket</Text>
        <Text style={styles.btn} onPress={() => navigation.navigate('notes')}>
          Notes
        </Text>
        {user.admin ? (
          <>
            <Text
              style={styles.btn}
              onPress={() => navigation.navigate('allusers')}>
              All users
            </Text>
            <Text
              style={styles.btn}
              onPress={() => navigation.navigate('allnotes')}>
              All notes
            </Text>
          </>
        ) : null}
      </View>
      <Text style={styles.logoutBtn} onPress={logoutHandler}>
        Logout
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    flexDirection: 'column',
  },

  heading: {
    fontSize: 60,
    fontWeight: 'bold',
  },

  btn: {
    color: 'white',
    backgroundColor: 'green',
    fontWeight: '100',
    paddingVertical: 10,
    paddingHorizontal: 50,
    width: '100%',
    textAlign: 'center',
    borderRadius: 4,
    marginVertical: 10,
  },

  logoutBtn: {
    color: 'white',
    backgroundColor: 'red',
    fontWeight: '100',
    paddingVertical: 6,
    paddingHorizontal: 50,
    textAlign: 'center',
    borderRadius: 50,
    margin: 40,
    alignSelf: 'center',
  },

  separator: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#111111',
    marginVertical: 16,
  },
});

export default Home;
