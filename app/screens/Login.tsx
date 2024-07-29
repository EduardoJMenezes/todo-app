import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { FIREBASE_APP } from '../../firebaseConfig'


const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const auth = getAuth(FIREBASE_APP)
  const navigation = useNavigation()

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      Alert.alert('Success', 'Account created successfully! Try login now.')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      Alert.alert('Success', 'Signed in successfully!')
      navigation.navigate('My Todos')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text: string) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text: string) => setPassword(text)}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      <View style={styles.button}>
        <Button onPress={signUp} title="Create account" />
      </View>
      <View style={styles.button}>
        <Button onPress={signIn} title="Sign in" />
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'column',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 5
  }
})