import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AddNote from './addNote';
import {useUser} from '../../context/UserContext';
import db from '../../database/db';
import OpenNote from './openNote';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isAddNoteForm, setIsAddNoteForm] = useState(false);
  const [isNoteOpened, setIsNoteOpened] = useState(false);
  const [currNote, setCurrNote] = useState({});

  const [reload, setReload] = useState(true);

  const {user} = useUser();

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (idx INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, desc TEXT, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(user_id))',
        [],
        (_, result) => {
          console.log('Notes Table successfully created');
        },
        error => {
          console.log('Error while creating table for notes', error);
        },
      );
      tx.executeSql(
        'SELECT * FROM notes WHERE user_id = ?',
        [user.id],
        (_, result) => {
          setNotes([]);
          for (let i = 0; i < result.rows.length; i++) {
            setNotes(oldNotes => {
              return [...oldNotes, result.rows.item(i)];
            });
          }
          console.log('All user notes successfully fetched');
        },
        error => {
          console.error('Error while fetching user notes => ', error);
        },
      );
    });
  }, [isAddNoteForm, user.id, reload]);

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

  const noteOpener = note => {
    setIsNoteOpened(true);
    setCurrNote(note);
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
                  <TouchableOpacity
                    key={i}
                    style={styles.row}
                    activeOpacity={0.5}
                    onPress={() => noteOpener(note)}>
                    <View>
                      <Text style={styles.title}>{note.title}</Text>
                      <Text style={styles.desc}>{note.desc}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      activeOpacity={0.4}
                      onPress={() => deleteNoteHandler(note.idx, note.user_id)}>
                      <Image
                        style={styles.binIconImg}
                        source={require('../../assets/bin.svg')}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={isAddNoteForm}
            onRequestClose={() => {
              setIsAddNoteForm(!isAddNoteForm);
            }}>
            <View style={styles.modal}>
              <View style={styles.form}>
                <AddNote setIsAddNoteForm={setIsAddNoteForm} />
              </View>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isNoteOpened}
            onRequestClose={() => {
              setIsNoteOpened(!isNoteOpened);
            }}>
            <View style={styles.modal}>
              <View style={styles.openNote}>
                <Text
                  style={styles.closeBtn}
                  onPress={() => setIsNoteOpened(!isNoteOpened)}>
                  Close
                </Text>
                <OpenNote note={currNote} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addIcon}
        activeOpacity={0.4}
        onPress={() => setIsAddNoteForm(!isAddNoteForm)}>
        <Image
          style={styles.addIconImg}
          source={require('../../assets/add.svg')}
        />
      </TouchableOpacity>
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

  closeBtn: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    zIndex: 999,
  },

  form: {
    flex: 1,
    backgroundColor: '#111111',
    color: 'white',
    borderRadius: 10,
  },

  openNote: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: '100%',
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

export default Notes;
