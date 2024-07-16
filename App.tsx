import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import List from './app/screens/List';
import Details from './app/screens/Details';

const Stack = createNativeStackNavigator()

export default function App() {

  // onAuthStateChanged(FIREBASE_AUTH, (user) => {
  //   if (user) {
   
  //   } else {
          //
  //   }
  //  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Todos" component={List} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
