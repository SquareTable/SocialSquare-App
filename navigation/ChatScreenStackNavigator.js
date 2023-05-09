import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";

import Conversations from "../screens/Conversations";
import CreateConversationSelection from "../screens/CreateConversationSelection";
import ConversationCreationPage from "../screens/CreateConversation";
import ConversationUserFind from "../screens/ConversationUserFind";
import ConversationDMUserFind from "../screens/ConversationDMUserFind";
import CreateDMConversation from "../screens/CreateDMConversation";
import Chat from "../screens/Chat";

const Stack = createStackNavigator();

const ChatScreen_Stack = () => {
    const { colors } = useTheme();
    return (
      <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: colors.tertiary,
          headerTransparent: true,
          title: '',
          headerLeftContainerStyle: {
              paddingLeft: 20,
          },
          headerLeft: null
        }}
      >
        <Stack.Screen name="Conversations" component={Conversations}/>
        <Stack.Screen name="CreateConversationSelection" component={CreateConversationSelection}/>
        <Stack.Screen name="CreateConversation" component={ConversationCreationPage}/>
        <Stack.Screen name="ConversationUserFind" component={ConversationUserFind}/>
        <Stack.Screen name="ConversationDMUserFind" component={ConversationDMUserFind}/>
        <Stack.Screen name="CreateDMConversation" component={CreateDMConversation}/>
        <Stack.Screen name="Chat" component={Chat}/>
      </Stack.Navigator>
    );
  };

export { ChatScreen_Stack };