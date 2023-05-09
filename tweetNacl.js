import nacl from 'tweet-nacl-react-native-expo'

//create encryption key
export const createChatKeys = async () => {
  const generatedKeyPair = await nacl.box.keyPair()
  const {publicKey, secretKey} = generatedKeyPair
  //console.log(publicKey, secretKey)
  //Encode b64
  const base64EncodedPublic = nacl.util.encodeBase64(publicKey)
  const base64EncodedPrivate = nacl.util.encodeBase64(secretKey)
  //Decode b64 (for later)
  //const base64DecodedPublic = nacl.util.decodeBase64(base64EncodedPublic)
  //const base64DecodedPrivate = nacl.util.decodeBase64(base64EncodedPrivate)
  const toSend = {publicKey: base64EncodedPublic, secretKey: base64EncodedPrivate}
  return toSend;
};