import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import db from '../../../database/db';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (_, result) => {
          setUsers([]);
          for (let i = 0; i < result.rows.length; i++) {
            setUsers(oldState => {
              return [...oldState, result.rows.item(i)];
            });
          }
          console.log('Users successfully fetched');
        },
        err => {
          console.error('Error while fetching data => ', err);
        },
      );
    });
  }, []);
  return (
    <ScrollView style={styles.container}>
      {users.map((user, i) => {
        return (
          <View key={i} style={styles.row}>
            <Text style={styles.rowText}>Id: {user.id}</Text>
            <Text style={styles.rowText}>Name: {user.name}</Text>
            <Text style={styles.rowText}>Email : {user.email}</Text>
            <Text style={styles.rowText}>Mobile : {user.mob}</Text>
            <Text style={styles.rowText}>Passsword : {user.pwd}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  heading: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  row: {
    backgroundColor: '#FFC6AC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  rowText: {fontSize: 14, color: '#111111'},
});

export default Users;
