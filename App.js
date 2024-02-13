import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import React, {useState, useEffect} from 'react';

export default function App() {

  const [initializing , setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId: '804516530685-5903u0jmq8si7cig2kbnso385bc3idnr.apps.googleusercontent.com',
  });

  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);
  }

  useEffect(()=>{
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);


  const onGoogleButtonPress = async () =>{
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user)=>{
      // console.log(user);
    }).catch((err)=>console.log(err));
  }

  const signOut = async()=>{
    try{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      setUser(null);
    }catch(error){
      console.log(error);
    }
  }

  if(initializing) return null;

  if(!user){
    return(
      <View style={styles.container}>
        <GoogleSigninButton
        style={{width:300, height: 65, marginTop: 300}}
        onPress={onGoogleButtonPress}
        ></GoogleSigninButton>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {user.uid}</Text>
      <Button title='signout' onPress={signOut}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
