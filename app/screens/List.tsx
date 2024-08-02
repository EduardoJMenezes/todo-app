import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, Fragment } from 'react'
import { FIRESTORE_DB } from '../../firebaseConfig'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Entypo } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

export interface Todo {
    title: string
    done: boolean
    id: string
    datetime: string
    description?: string
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [todo, setTodo] = useState('')
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    useEffect(() => {
        const todoRef = collection(FIRESTORE_DB, 'todos')

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                console.log('UPDATED')
                const todos: Todo[] = []
                snapshot.docs.forEach((doc) => {
                    console.log(doc.data())
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    } as Todo)
                })
                setTodos(todos)
            }
        })
        return () => subscriber()
    }, [])

    const addTodo = async () => {
        const doc = await addDoc(collection(FIRESTORE_DB, 'todos'), { title: todo, done: false, datetime: date.toISOString() })
        setTodo('')
        setDate(new Date())
        console.log(doc)
    }

    const renderTodo = ({ item }: { item: Todo }) => {
        const ref = doc(FIRESTORE_DB, `todos/${item.id}`)
        const toggleDone = async () => {
            updateDoc(ref, { done: !item.done })
        }

        const deleteItem = async () => {
            deleteDoc(ref)
        }

        const navigateToDetails = () => {
            navigation.navigate('Details', { id: item.id })
        }

        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done && <Ionicons name="checkmark-circle" size={32} color="green" />}
                    {!item.done && <Entypo name="circle" size={32} color="black" />}
                    <TouchableOpacity onPress={navigateToDetails}>
                        <View>
                            <Text style={styles.todoText}>{item.title}</Text>
                            <Text style={styles.todoDatetime}>{format(new Date(item.datetime), 'dd/MM/yyyy HH:mm')}</Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
                <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />
            </View>
        )
    }

    return (
        <Fragment>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Add new Todo"
                    onChangeText={(text: string) => setTodo(text)}
                    value={todo}
                />
                <Button onPress={() => setShowDatePicker(true)} title="Pick Date" />
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false)
                            if (selectedDate) {
                                setDate(new Date(selectedDate.setHours(date.getHours(), date.getMinutes())))
                                setShowTimePicker(true)
                            }
                        }}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false)
                            if (selectedTime) {
                                const currentDate = new Date(date)
                                currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
                                setDate(currentDate)
                            }
                        }}
                    />
                )}
                <Button onPress={addTodo} title="Add Todo" disabled={todo === ''} />
            </View>
            {todos.length > 0 && (
                <View>
                    <FlatList
                        data={todos}
                        renderItem={(item) => renderTodo(item)}
                        keyExtractor={(todo: Todo) => todo.id}
                    />
                </View>
            )}
        </Fragment>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4
    },
    todo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoDatetime: {
        fontSize: 12,
        color: 'gray'
    }
})