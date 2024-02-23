import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';

const List = ({list}) => {
  return (
    <ScrollView style={styles.container}>
      {list.map((elem, i) => {
        return (
          <View key={i} style={styles.row}>
            <Text style={styles.rowText}>{elem}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, flex: 1},
  row: {
    backgroundColor: '#94A684',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 6,
  },
  rowText: {fontSize: 20, textAlign: 'center', color: '#111111'},
});

export default List;
