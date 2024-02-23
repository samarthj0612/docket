import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUser} from '../../../context/UserContext';
import db from '../../../database/db';

const AllNotes = () => {
  const [notes, setNotes] = useState([]);

  const [reload, setReload] = useState(true);

  const {user} = useUser();

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM notes',
        [],
        (_, result) => {
          setNotes([]);
          for (let i = 0; i < result.rows.length; i++) {
            setNotes(oldNotes => {
              return [...oldNotes, result.rows.item(i)];
            });
          }
          console.log('All notes successfully fetched');
        },
        error => {
          console.error('Error while fetching notes => ', error);
        },
      );
    });
  }, [user.id, reload]);

  const deleteNoteHandler = (noteId, userId) => {
    if (userId !== user.id && user.admin === 0) {
      Alert.alert('Something went wrong');
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM notes WHERE idx = ?',
          [noteId],
          (_, result) => {
            console.info('Note successfully deleted');
            console.info('Result => ', result);
            setReload(oldState => !oldState);
          },
        );
      });
    }
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {!notes.length ? (
            <Text style={styles.heading}>All Notes here</Text>
          ) : (
            <>
              {notes.map((note, i) => {
                return (
                  <View key={i} style={styles.row}>
                    <Text style={styles.title}>{note.idx}</Text>
                    <Text style={styles.title}>{note.title}</Text>
                    <Text style={styles.desc}>{note.desc}</Text>
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      activeOpacity={0.4}
                      onPress={() => deleteNoteHandler(note.idx, note.user_id)}>
                      <Image
                        style={styles.binIconImg}
                        source={require('../../../assets/bin.svg')}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  scrollContainer: {
    flex: 1,
    padding: 5,
  },

  heading: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  deleteIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'black',
    padding: 8,
    backgroundColor: 'white',
  },

  addIconImg: {
    height: 40,
    width: 40,
  },

  binIconImg: {
    height: 15,
    width: 15,
  },

  modal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  form: {
    flex: 1,
    backgroundColor: '#111111',
    color: 'white',
    borderRadius: 10,
  },

  row: {
    width: '45%',
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
    minHeight: 200,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    color: '#111111',
    textAlign: 'center',
    marginBottom: 10,
  },

  desc: {fontSize: 12, textAlign: 'justify'},
});

export default AllNotes;
