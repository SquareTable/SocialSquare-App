import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ParseErrorMessage from '../../../components/ParseErrorMessage';

//const postsJSON = require('./posts_1.json')

export default function App() {
  const [currentAppPage, setCurrentAppPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [message, setMessage] = useState('')
  /*
  function returnDecodedString(encodedString, postMedia) {
    if (encodedString) {
      const utf8 = new Uint8Array(Array.prototype.map.call(encodedString, c => c.charCodeAt(0)));
      return new TextDecoder('utf8').decode(utf8)
    } else {
      if (postMedia.length != 1) {
        console.log('There is no description')
        return ''
      } else {
        if (postMedia[0].title) {
          const utf8 = new Uint8Array(Array.prototype.map.call(postMedia[0].title, c => c.charCodeAt(0)));
          return new TextDecoder('utf8').decode(utf8)
        } else {
          console.log('There is no description')
          return ''
        }
      }
    }
  }
  
  const allowScreenshots = false;
  const creatorID = 1001001;
  
  var postsToAdd = [];
  
  postsJSON.forEach((post, index) => {
    const formData = new FormData();
    post.media.forEach((image, index) => {
      formData.append("images[]", {
        name: image.uri.substr(image.uri.lastIndexOf('media/') + 6),
        uri: image.uri.substr(image.uri.lastIndexOf('media/') + 6),
        type: 'image/jpg'
      })
    })
    formData.append("title", '')
    formData.append("description", returnDecodedString(post.title, post.media))
    formData.append("creatorId", creatorID)
    formData.append("sentAllowScreenShots", allowScreenshots)
  
    postsToAdd.push(formData)
  })
  
  console.log(postsToAdd)
  console.log('hi')
  */
  const loginToAccount = () => {
    if (loggingIn == false) {
      setMessage('')
      setLoggingIn(true)
      const credentials = {email: email, password: password}
      const url = "http://it-solutions.homedns.org:9443/user/signin"

      axios.post(url, credentials).then((response) => {
        const result = response.data
        const {message, status, data} = result;

        if (status !== 'SUCCESS') {
          setLoggingIn(false)
          console.log(message)
          setMessage(message)
        } else {
          alert(data)
          setMessage('')
          setCurrentAppPage('transfer')
        }
      }).catch((error) => {
        console.error(error)
        setLoggingIn(false)
        setMessage(ParseErrorMessage(error))
      })
    }
  }

  if (currentAppPage == 'login') {
    return (
      <View style={styles.container}>
        <Image source={require('./assets/instagram.png')} style={styles.logo} />
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'}}>Login to SocialSquare to transfer your posts from Instagram to SocialSquare</Text>
        {message != '' ? <Text style={{color: 'red', fontSize: 16, marginBottom: 10}}>{message}</Text> : null}
        <TextInput
          placeholder='Email'
          text={email}
          onChangeText={(text) => setEmail(text)}
          style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 5, marginBottom: 10, borderRadius: 10}}
          onSubmitEditing={loginToAccount}
        />
        <TextInput
          placeholder='Password'
          text={password}
          onChangeText={(text) => setPassword(text)}
          style={{height: 40, borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 10}}
          secureTextEntry={true}
          onSubmitEditing={loginToAccount}
        />
        {loggingIn ?
          <ActivityIndicator size="large" color="black" />
        :
          <TouchableOpacity onPress={loginToAccount} style={{marginTop: 30, borderColor: 'black', borderWidth: 2, padding: 10, borderRadius: 20}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Login</Text>
          </TouchableOpacity>
        }
      </View>
    );
  } else {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 200,
    width: 200
  }
});
