import React, { useState, useEffect } from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { FIRESTORE_DB } from '../../firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const Details = ({ route, navigation }: any) => {
  const { id } = route.params
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const fetchTodo = async () => {
      const todoRef = doc(FIRESTORE_DB, `todos/${id}`)
      const todoSnap = await getDoc(todoRef)
      if (todoSnap.exists()) {
        const todo = todoSnap.data()
        setTitle(todo.title)
        setDescription(todo.description || '')
      } else {
        Alert.alert('Error', 'Todo not found')
        navigation.goBack()
      }
    }
    fetchTodo()
  }, [id])

  const updateTodo = async () => {
    const todoRef = doc(FIRESTORE_DB, `todos/${id}`)
    await updateDoc(todoRef, { title, description })
    Alert.alert('Success', 'Todo updated successfully')
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />
      <Button title="Save" onPress={updateTodo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  textArea: {
    height: 100,
  },
})

export default Details
