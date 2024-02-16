import { useContext } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { 
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from '../screens/screenStylings/styling';
import { StatusBarHeightContext } from './StatusBarHeightContext';
import { Image } from 'react-native';

const TopNavBar = ({extraStyles = {}, rightIcon, screenName, hideBackButton, hideTitle, leftIconChild, leftIcon}) => {
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors} = useTheme();
    const navigation = useNavigation();


    return (
        <ChatScreen_Title style={[{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight, height: 'auto', paddingBottom: 5}, extraStyles]}>
            {hideBackButton ? null :
                leftIcon || (
                    <Navigator_BackButton style={{paddingTop: StatusBarHeight - 8}} onPress={() => {navigation.goBack()}}>
                        {leftIconChild || (
                            <Image
                                source={require('../assets/app_icons/back_arrow.png')}
                                style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        )}
                    </Navigator_BackButton>
                )
            }
            {hideTitle ? null :
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{screenName}</TestText>
            }
            {rightIcon}
        </ChatScreen_Title>
    )
}

export default TopNavBar;