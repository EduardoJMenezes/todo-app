import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Alert } from 'react-native'
import { FIRESTORE_DB } from '../../firebaseConfig'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Entypo } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { CalendarList } from 'react-native-calendars'

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
    const [showCalendar, setShowCalendar] = useState(false)
    const [markedDates, setMarkedDates] = useState({})

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

    useEffect(() => {
        const dates = todos.reduce((acc: any, todo: Todo) => {
            const date = todo.datetime.split('T')[0]
            if (acc[date]) {
                acc[date].dots.push({ color: 'blue', selectedDotColor: 'blue' })
            } else {
                acc[date] = { dots: [{ color: 'blue', selectedDotColor: 'blue' }] }
            }
            return acc
        }, {})

        setMarkedDates(dates)
    }, [todos])

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
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconButton}>
                    <Ionicons name="time-outline" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={addTodo} style={styles.iconButton}>
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.calendarButton}>
                <Ionicons name="calendar-outline" size={24} color="white" />
            </TouchableOpacity>
            {todos.length > 0 && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={todos}
                        renderItem={(item) => renderTodo(item)}
                        keyExtractor={(todo: Todo) => todo.id}
                    />
                </View>
            )}
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
            <Modal visible={showCalendar} animationType="slide">
                <View style={styles.modalContainer}>
                    <Button title="Close" onPress={() => setShowCalendar(false)} />
                    <CalendarList
                        markingType={'multi-dot'}
                        markedDates={markedDates}
                        onDayPress={(day) => {
                            const todosForDay = todos.filter(todo => todo.datetime.startsWith(day.dateString))
                            if (todosForDay.length > 0) {
                                Alert.alert('Todos', todosForDay.map(todo => todo.title).join('\n'))
                            }
                        }}
                    />
                </View>
            </Modal>
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
    iconButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    listContainer: {
        marginTop: 10,
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
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
})