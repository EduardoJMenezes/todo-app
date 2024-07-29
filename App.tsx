import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import List from './app/screens/List'
import Login from './app/screens/Login'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { FIREBASE_AUTH } from './firebaseConfig' // ajuste o caminho conforme necessário

const Stack = createNativeStackNavigator()

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setAuthenticated(!!user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authenticated ? "My Todos" : "Login"}>
        <Stack.Screen name="My Todos" component={List} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}