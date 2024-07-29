import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const auth = getAuth()

  const signUp = async() => {
    createUserWithEmailAndPassword(auth, email, password)
    alert('Check your emails!')
  }

  const signIn = async() => {
    signInWithEmailAndPassword(auth, email, password)
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
      <TextInput style={styles.input} textContentType='password' placeholder="Password" onChangeText={(text: string) => setPassword(text)} value={password} />
      
      <Button onPress={signUp} title="Create account" />
      <Button onPress={signIn} title="Sign in" />
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'column',
    paddingVertical: 20
  },
  input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
  }
})