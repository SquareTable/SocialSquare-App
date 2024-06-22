import styled from "styled-components/native";
import Constants from "expo-constants";

/* Kovid's code*/

const StatusBarHeight = Constants.statusBarHeight;

//Colours

export const Colors = {
    primary: '#3b4252',
    secondary: '#88c0d0',
    tertiary: '#eceff4',
    darkLight: '#4c566a',
    brand: '#88c0d0',
    green: '#A3BE8C',
    red: '#BF616A',
    darkest: '#2e3440',
    greyish: '#D8DEE9',
    bronzeRarity: '#b08d57',
    darkestBlue: '#5E81AC',
    orange: '#D08770',
    yellow: '#EBCB8B',
    purple: '#B48EAD',
    slightlyLighterGrey: '#434C5E',
    midWhite: '#E5E9F0',
    slightlyLighterPrimary: '#424a5c',
    descTextColor: '#abafb8'
};

const {primary, secondary,tertiary, darkLight, brand, green, red, darkest, greyish, bronzeRarity, darkestBlue, orange, yellow, purple, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor} = Colors;

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top: ${StatusBarHeight + 10}px;
    background-color: ${primary};
`

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    padding-vertical: 25px;
    padding-top: ${StatusBarHeight + 10}px;
`;

export const WelcomeContainer = styled(InnerContainer)`
    background-color: ${primary};
    flex: 1;
    width: 100%;
    display: flex;
    padding-vertical: 25px;
    ${props => props.postScreen == true &&`
        justify-content: center;
    `}
`;

export const PageLogo = styled.Image`
    width: 95px;
    height: 95px;
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-bottom: 10px;
    margin-top: 10px;
    ${(props) => props.searchPage == true && `
        width: 80px;
        height: 80px;
        margin-bottom: 0px;
    `}
`;


export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
    ${(props) => props.welcome && `
        font-size: 35px;
    `}
    ${(props) => props.badges && `
        margin-top: 10px;
        font-size: 35px;
    `}
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}

    ${(props) => props.profText && `
        margin-top: 8px;
    `}

    ${(props) => props.bioText && `
        margin-top: 8px;
    `}

    ${(props) => props.profNoPosts && `
        text-align: center;
        align-self: center;
        margin-top: 40px;
        margin-bottom: 40px;
    `}
    ${(props) => props.disclaimerText && `
        text-align: center;
        align-self: center;
    `}
    ${(props) => props.searchResTitle && `
        margin-bottom: 5px;
    `}
    ${(props) => props.searchResTitleDisplayName && `
        margin-bottom: 5px;
        font-size: 14px;
        font-weight: normal;
    `}
`;

export const StyledFormArea = styled.View`
    width: 90%;
    ${props => props.theOutline == true &&`
        width: 98%;
        padding: 2%;
        border-width: 3px;
        border-color: ${darkest};
    `}
    ${props => props.visibility == true &&`
        width: 100%;
    `}
    ${props => props.visibility == false &&`
        width: 100%;
        left: -30000px;
        position: absolute;
    `}
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${darkest};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    border-color: ${secondary};
    border-width: 5px;
    font-size: 16px;
    width: 100%;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
    ${props => props.postComment == true &&`
        padding-left: 0px;
        padding-right: 0px;
        padding: 15px;
        border-radius: 30px;
        border-color: ${tertiary};
        border-width: 2px;
    `}
    ${props => props.searchPage == true &&`
        width: 100%;
        padding: 10px;
        padding-left: 55px;
        border-radius: 30px;
        border-color: ${tertiary};
        border-width: 2px;
    `}
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 34px;
    position: absolute;
    z-index: 1;
    ${(props) => props.searchIcon == true && `
        top: 30px;
    `}
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 31px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${brand};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;

    ${(props) => props.signUpButton == true && `
        background-color: ${primary};
        border-radius: 5px;
        border-color: ${secondary};
        border-width: 5px;
        flex-direction: row;
        justify-content: center;
    `}

    ${(props) => props.continueButton == true && `
        margin-top: 20px;
        padding: 40px;
        background-color: ${primary};
        border-radius: 5px;
        border-color: ${secondary};
        border-width: 5px;
        flex-direction: row;
        justify-content: center;
    `}

    ${(props) => props.postCategory == true && `
        padding: 30px;
        background-color: ${darkLight};
        border-radius: 5px;
        border-color: ${slightlyLighterGrey};
        border-width: 3px;
        flex-direction: row;
        justify-content: center;
    `}
    
    ${(props) => props.postComment == true && `
        margin-vertical: 0px;
        background-color: ${primary};
        justify-content: center;
        padding: 15px;
        height: 15px;
    `}

    ${(props) => props.postImage == true && `
        width: 100px;
        height: 100px;
        borderRadius: 80px;
        textAlign: center;
        alignItems: center;
        justifyContent: center;
        borderStyle: dashed;
        borderWidth: 1px;
        border-color: ${tertiary};
        background-color: ${darkLight};
    `}

    ${(props) => props.removeImage == true && `
        width: 40px;
        height: 40px;
        padding: 0px;
        borderRadius: 20px;
        textAlign: center;
        alignItems: center;
        justifyContent: center;
        borderStyle: dashed;
        borderWidth: 1px;
        border-color: ${tertiary};
        background-color: ${darkLight};
        align-self: center;
    `}
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;

    ${(props) => props.signUpButton == true && `
        color: ${secondary};
        padding: 25px; 
    `}

    ${(props) => props.continueButton == true && `
        font-size: 25px;
        color: ${secondary};
        padding: 25px; 
    `}
    
    ${(props) => props.postCategory == true && `
        font-size: 20px;
        color: ${midWhite};
        padding: 25px; 
        font-weight: 100;
    `}
    
    ${(props) => props.postComment == true && `
        font-size: 15px;
        color: ${secondary};
        padding: 25px; 
    `}

    ${(props) => props.postImage == true && `
        font-size: 40px;
        color: ${tertiary};
    `}

    ${(props) => props.removeImage == true && `
        font-size: 20px;
        color: ${tertiary};
    `}
`;

export const MsgBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${(props) => (props.type == 'SUCCESS' ? green : red)};
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color = ${darkLight};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 3px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content: center;
    color: ${tertiary};
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    ${(props) => props.addPollText == true && `
        width: 40%;
        margin-right: 5%;
    `}
    ${(props) => props.removePollText == true && `
        width: 40%;
        margin-left: 5%;
    `}
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size: 25px;
    margin-bottom: 10px;
    ${(props) => props.loginText == true && `
        font-size: 18px;
        margin-bottom: 0px;
    `}
    ${(props) => props.addPollText == true && `
        font-size: 15px;
    `}
    ${(props) => props.removePollText == true && `
        color: ${red};
        font-size: 15px;
    `}
`;

export const ProfInfoAreaImage = styled.View`
    align-items: center;
    text-align: center;
    width: 100%;
`;

export const ProfileBadgesView = styled.TouchableOpacity`
    align-items: center;
    flexDirection: row;
    border-top-width: 3px;
    border-bottom-width: 3px;
    border-color: ${darkest}
`;

export const ProfileBadgeIcons = styled.Image`
    width: 25px;
    height: 25px;
    margin-horizontal: 3px;
    margin-top: 6px;
    margin-bottom: 12px;
`;

export const ProfileHorizontalView = styled.View`
    flexDirection: row;
`;

export const ProfileTopBtns = styled.TouchableOpacity`
    position: absolute;
    zIndex: 100;
    width: 10%;
    background-color: ${secondary};
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    margin-vertical: 5px;
    height: 40px;
    ${(props) => props.rightSide == true && `
        left: 35% ;
    `}
    ${(props) => props.leftSide == true && `
        right: 35%;
    `}
`;

export const CategoriesTopBtns = styled.TouchableOpacity`
    width: 10%;
    background-color: ${secondary};
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    margin-vertical: 5px;
`;

export const TopButtonIcons = styled.Image`
    width: 100%;
    height: 100%;
`;


export const ProfileHorizontalViewItem = styled.View`
    border-color: ${darkest};
    flex: 1;
    align-items: center;
    text-align: center;
    border-top-width: 3px;
    border-bottom-width: 3px;
    ${(props) => props.profCenterIcon == true && `
        border-right-width: 3px;
        border-left-width: 3px;
    `}
`;

export const PollHorizontalViewItem = styled.View`
    border-color: ${darkest};
    flex: 1;
    align-items: center;
    text-align: center;
    border-top-width: 3px;
    border-bottom-width: 3px;
`;

export const PollHorizontalViewItemCenter = styled.TouchableOpacity`
    border-color: ${darkest};
    flex: 1;
    align-items: center;
    text-align: center;
    border-radius: 5px;
    padding-vertical: 5px;
    border-top-width: 3px;
    border-bottom-width: 3px;
    border-right-width: 3px;
    border-left-width: 3px;
`;


export const ProfIcons = styled.Image`
    width: 45px;
    height: 45px;
    margin-bottom: 8px;
`;

export const ProfilePostsSelectionView = styled.View`
    width: 100%;
    border-color: ${darkest};
    align-items: center;
    border-bottom-width: 3px;
    flexDirection: row;
`;

export const ProfilePostsSelectionBtns = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-vertical: 5px;
    margin-horizontal: 5px;
    height: 60px;
`;

export const ProfileGridPosts = styled.View`
    width: 100%;
    align-items: center;
    border-color: ${darkest};
    border-bottom-width: 3px;
    flex: 1;
`;

export const ProfileFeaturedPosts = styled.View`
    border-color: ${darkest};
    border-bottom-width: 3px;
`;

export const SettingsPageItemTouchableOpacity = styled.TouchableOpacity`
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-color: ${darkest};
    border-width: 3px;
    margin-bottom: 10px;
`;

export const SettingsItemImage = styled.Image`
    width: 45px;
    height: 45px;
    margin-top: 5px;
`;

export const SettingsItemText = styled.Text`
    color: ${tertiary};
    align-self: center;
    font-size: 20px;
    margin-bottom: 5px;
    ${(props) => props.titleIfSubTitle == true && `
        font-size: 22px;
    `}
    ${(props) => props.subTitle == true && `
        color: ${darkestBlue};
        font-size: 20px;
    `}
`;

export const ConfirmLogoutView = styled.View`
    position: absolute;
    zIndex: 100;
    align-self: center;
    align-items: center;
    margin-vertical: 30%;
    left: -30000px;
    width: 90%;
    height: 400px;
    background-color: ${darkest};
    border-color: ${secondary};
    border-radius: 20px;
    border-width: 3px;
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: 0px;
    `}
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
`;

export const ConfirmLogoutText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 40px;
    margin-vertical: 10px;
`;

export const ConfirmLogoutButtons = styled.TouchableOpacity`
    height: 25%;
    margin-top: 5%;
    align-items: center;
    justify-content: center;
    width: 80%;
    border-radius: 20px;
    border-width: 3px;
    border-color: ${primary};
    ${(props) => props.cancelButton == true && `
        background-color: ${greyish};
    `}
    ${(props) => props.confirmButton == true && `
        background-color: ${red};
    `}
`;

export const ConfirmLogoutButtonText = styled.Text`
    color: ${darkest};
    align-self: center;
    text-align: center;
    font-size: 25px;
    margin-vertical: 10px;
    ${(props) => props.cancelButton == true && `
        color: ${darkest};
    `}
    ${(props) => props.confirmButton == true && `
        color: ${tertiary};
    `}
`;

export const BadgeGridLayout = styled.View`
    justifyContent: center;
    margin: 10px;
`;

export const BackgroundDarkColor = styled.View`
    background-color: ${primary};
    height: 100%;
    minHeight: 100%;
    zIndex: -100;
`;

export const ProfileOptionsView = styled.View`
    position: absolute;
    zIndex: 9999999;
    align-self: center;
    align-items: center;
    margin-vertical: 30%;
    left: -30000px;
    width: 90%;
    height: 400px;
    background-color: ${darkest};
    border-color: ${secondary};
    border-radius: 20px;
    border-width: 3px;
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: 0px
    `}
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
`;

export const ProfileOptionsViewButtons = styled.TouchableOpacity`
    height: 20%;
    margin-top: 5%;
    align-items: center;
    justify-content: center;
    width: 80%;
    border-radius: 20px;
    border-width: 3px;
    border-color: ${primary};
    ${(props) => props.greyButton == true && `
        background-color: ${greyish};
    `}
    ${(props) => props.redButton == true && `
        background-color: ${red};
    `}
`;

export const ProfileOptionsViewButtonsText = styled.Text`
    color: ${darkest};
    align-self: center;
    text-align: center;
    font-size: 25px;
    margin-vertical: 10px;
    ${(props) => props.greyButton == true && `
        color: ${darkest};
    `}
    ${(props) => props.redButton == true && `
        color: ${tertiary};
    `}
`;

export const ProfileOptionsViewText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 30px;
    margin-vertical: 10px;
`;

export const ProfileOptionsViewSubtitleText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 24px;
    margin-vertical: 3px;
`;

export const TermsOfServiceGoBackButton = styled.TouchableOpacity`
    height: 80px;
    margin-top: 10%;
    align-items: center;
    justify-content: center;
    width: 80%;
    border-radius: 20px;
    border-width: 3px;
    border-color: ${primary};
    background-color: ${greyish};
    align-self: center;
`;

export const TermsOfServiceGoBackButtonText = styled.Text`
    color: ${darkest};
    align-self: center;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    margin-vertical: 10px;
    color: ${darkest};
`;

export const TermsOfServiceBackground = styled.SafeAreaView`
    backgroundColor: ${primary};
    flex: 1;
`;

export const ReportProfileOptionsView = styled.View`
    position: absolute;
    zIndex: 9999999;
    align-self: center;
    align-items: center;
    margin-vertical: 30%;
    left: -30000px;
    width: 90%;
    height: 550px;
    background-color: ${darkest};
    border-color: ${secondary};
    border-radius: 20px;
    border-width: 3px;
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: 0px
    `}
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.post == true && `
        height: 450px;
    `}
`;

export const ReportProfileOptionsViewButtons = styled.TouchableOpacity`
    margin-top: 5%;
    align-items: center;
    justify-content: center;
    width: 80%;
    border-radius: 20px;
    border-width: 3px;
    border-color: ${primary};
    flex-wrap: wrap;
    text-align: center;
    align-self: center;
    align-content: center;
    ${(props) => props.greyButton == true && `
        background-color: ${greyish};
    `}
    ${(props) => props.redButton == true && `
        background-color: ${red};
    `}
`;

export const ReportProfileOptionsViewButtonsText = styled.Text`
    color: ${darkest};
    align-self: center;
    text-align: center;
    font-size: 25px;
    margin-vertical: 10px;
    ${(props) => props.greyButton == true && `
        color: ${darkest};
    `}
    ${(props) => props.redButton == true && `
        color: ${tertiary};
    `}
`;

export const ReportProfileOptionsViewText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 30px;
    margin-vertical: 10px;
`;

export const ReportProfileOptionsViewSubtitleText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 10px;
    margin-vertical: 3px;
`;

/* Code from merge of Kovid's code 17/08/21 */
export const BadgeGridViewBlockStyle = styled.TouchableOpacity`
    justifyContent: center;
    flex: 1;
    alignItems: center;
    margin: 2.5%;
    padding-horizontal: 20%;
    border-color: ${secondary};
    border-width: 3px;
`;

export const GridViewInsideTextItemStyle = styled.Text`
    color: ${tertiary};
    justifyContent: center;
    ${(props) => props.badgeTitle == true &&`
        fontSize: 20px;
    `}
    ${(props) => props.bottomText == true && `
        margin-bottom: 10px;
        fontSize: 18px;
    `}
    ${(props) => props.rarityForTextColor == "Bronze" && `
        fontSize: 25px;
        margin-top: 10px;
        color: ${bronzeRarity};
    `}
`;

export const BadgeGridViewImage = styled.Image`
    margin-vertical: 10px;
    width: 80px;
    height: 80px;
`;

export const PostCollectionView = styled.View`
    margin-top: 10px;
    align-items: center;
    justify-content: center;
`;

export const PostHorizontalView = styled.View`
    flexDirection: row;
    ${(props) => props.centerAlign == true && `
        align-items: center;
        justify-content: center;
        text-align: center;
    `}
    ${(props) => props.marginVertical != undefined && `
        margin-vertical: ${props.marginVertical}px;
    `}
`;

export const PostTypeSelector = styled.TouchableOpacity`
    padding-horizontal: 15px;
    padding-vertical: 15px;
    border-width: 3px;
    border-color: ${brand};
    border-radius: 100px;
    ${(props) => props.sideIcons == true && `
        margin-horizontal: 40px;
    `}
    ${(props) => props.centerIcon == true && `
        margin-horizontal: 20px;
    `}
    ${(props) => props.noMarginHorizontal == true && `
        margin-horizontal: 0px;
    `}
    ${(props) => props.styleForSelected == true && `
        border-color: ${darkestBlue};
    `} 
`;

export const PostIcons = styled.Image`
    width: 60px;
    height: 60px;
`;

export const PostMsgBox = styled.Text`
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    color: ${red};
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        text-align: center;
        align-self: center;
        align-items: center;
        left: 0px;
    `}
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
`;
/* End of code from code merge of 17/08/21 */

export const FlexRow = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: center;
`;

export const LeftButton_AudioUploadScreen = styled.View`
    margin-right: 7%
`;

export const RightButton_AudioUploadScreen = styled.View`
    margin-left: 7%
`;

export const AudioUploadScreenUploadButtons = styled.View`
    justify-content: center;
    align-self: center;
    align-content: center;
    align-items: center;
    margin-top: 20%;
`;

export const HorizontalLineAcrossScreen = styled.View`
    z-index: 100;
    ${(props) => `
        width: ${props.elementWidth}
    `}
    ${(props) => `
        height: ${props.elementHeight}
    `}
    ${(props) => `
        background-color: ${props.elementColor}
    `}
`;

export const RecordAudio_AudioUploadPage = styled.View`
    position: absolute;
    zIndex: 9999999;
    align-self: center;
    align-items: center;
    margin-vertical: 30%;
    left: -30000px;
    width: 90%;
    height: 400px;
    background-color: ${darkest};
    border-color: ${secondary};
    border-radius: 20px;
    border-width: 3px;
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: 0px
    `}
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
`;

export const RecordButton_RecordScreen_AudioUploadPage = styled.TouchableOpacity`
    position: absolute;
    right: 20%;
    padding-right: 10px;
    border-right-width: 3px;
    border-color: ${tertiary};
    width: 80px;
`;

export const RecordButtonChanger_RecordScreen_AudioUploadPage = styled.View`
    ${(props) => props.viewHidden == true && `
        position: absolute;
        left: 30000px;
    `}
`;

export const AudioWaveBox_RecordScreen_AudioUploadPage = styled.View`
    border-width: 0px;
    border-radius: 50px;
    border-color: ${tertiary};
    width: 60%;
    ${(props) => props.viewHidden == true && `
        position: absolute;
        left: 30000px;
    `}
`;

export const ViewHider = styled.View`
    ${(props) => props.viewHidden == true && `
        position: absolute;
        left: 30000px;
    `}
    ${(props) => props.bugScreenVarNum !== 2 && props.bugScreen == 2 && `
        position: absolute;
        left: 30000px;
    `}
    ${(props) => props.bugScreenVarNum !== 1 && props.bugScreen == 1 && `
        position: absolute;
        left: 30000px;
    `}
    ${(props) => props.zIndex && `
        z-index: ${props.zIndex};
    `}
`;

export const TestText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${tertiary};
    text-align: center;
`;

export const ChatScreenNavigator_Row_Styling = styled.TouchableOpacity`
    background-color: ${darkLight}
    border-color: ${darkest};
    border-width: 2px;
    height: 65px;
    margin-horizontal: 2px;
    flex-direction: row;
`;

export const BackgroundDarkColor_SafeAreaView = styled.SafeAreaView`
    background-color: ${primary};
    height: 100%;
`;

export const ChatScreenNavigator_Title = styled.View`
    border-width: 1px;
    border-color: ${primary};
    height: 45px;
`;

export const FlexRow_NOJustifyContent = styled.View`
    flex: 1;
    flex-direction: row;
`;

export const ChatScreen_Title = styled.View`
    border-width: 1px;
    border-color: ${primary};
    height: 90px;
    background-color: ${primary};
    padding-top: ${StatusBarHeight + 10}px;
`;

export const Chat_Info_Icon_Styling = styled.TouchableOpacity`
    position: absolute;
    right: 10px;
    padding-top: ${StatusBarHeight + 2}px;
`;

export const ChatScreenInformation_Title = styled.View`
    border-width: 1px;
    border-color: ${primary};
    height: 90px;
    background-color: ${primary};
    padding-top: ${StatusBarHeight + 9}px;
`;

export const Navigator_BackButton = styled.TouchableOpacity`
    position: absolute;
    left: 10px;
    padding-top: ${StatusBarHeight + 2}px;
    z-index: 10000;
`;

export const Post_Fullscreen_Title = styled.View`
    border-width: 1px;
    border-color: ${primary};
    height: 45px;
`;

export const Post_Fullscreen_Title_BackButton = styled.TouchableOpacity`
    z-index: 10000;
    position: absolute;
    top: -7px;
`;

/* Start of code from merge 31st October 2021 */

export const AboveButtonText = styled.Text`
    align-self: center;
    color: ${tertiary};
    font-size: 16px;
    ${(props) => props.byCheckBox == true && `
        margin-top: 20px;
    `}
`;

export const CheckBoxForPosts = styled.TouchableOpacity`
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 20px;
    border-width: 3px;
    border-color: ${darkest};
    ${(props) => props.selectedState == true && `
        background-color: ${green};
    `}
    ${(props) => props.selectedState == false && `
        background-color: ${primary};
    `}
`;

export const ChangePollOptionColorView = styled.View`
    align-self: center;
    align-items: center;
    left: -30000px;
    width: 90%;
    background-color: ${darkest};
    border-color: ${secondary};
    border-radius: 20px;
    border-width: 3px;
    ${(props) => props.viewHidden == false && `
        margin-left: 5%;
        margin-right: 5%;
        align-self: center;
        align-items: center;
        left: 0px;
    `}
    ${(props) => props.viewHidden == true && `
        margin-left: 5%;
        margin-right: 5%;
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
`;

export const ChangePollOptionColorText = styled.Text`
    color: ${tertiary};
    align-self: center;
    text-align: center;
    font-size: 20px;
    margin-vertical: 10px;
`;

export const ChangePollOptionColorButtons = styled.TouchableOpacity`
    margin-top: 5%;
    align-items: center;
    justify-content: center;
    width: 80%;
    border-radius: 20px;
    border-width: 3px;
    border-color: ${primary};
    ${(props) => props.cancelButton == true && `
        background-color: ${greyish};
    `}
    ${(props) => props.confirmButton == true && `
        background-color: ${red};
    `}
`;

export const ChangePollOptionColorButtonText = styled.Text`
    color: ${darkest};
    align-self: center;
    text-align: center;
    font-size: 25px;
    margin-vertical: 10px;
    ${(props) => props.cancelButton == true && `
        color: ${darkest};
    `}
    ${(props) => props.confirmButton == true && `
        color: ${tertiary};
    `}
`;

export const RedCheckBoxForColor = styled.TouchableOpacity`
    border-radius: 30px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    border-width: 3px;
    border-color: ${tertiary};
    background-color: ${red};
    ${(props) => props.selectedState == "Red" && `
        border-color: ${brand};
    `}
    ${(props) => props.selectedState !== "Red" && `
        border-color: ${tertiary};
    `}
`;

export const OrangeCheckBoxForColor = styled.TouchableOpacity`
    border-radius: 30px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    border-width: 3px;
    border-color: ${tertiary};
    background-color: ${orange};
    ${(props) => props.selectedState == "Orange" && `
        border-color: ${brand};
    `}
    ${(props) => props.selectedState !== "Orange" && `
        border-color: ${tertiary};
    `}
`;

export const YellowCheckBoxForColor = styled.TouchableOpacity`
    border-radius: 30px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    border-width: 3px;
    border-color: ${tertiary};
    background-color: ${yellow};
    ${(props) => props.selectedState == "Yellow" && `
        border-color: ${brand};
    `}
    ${(props) => props.selectedState !== "Yellow" && `
        border-color: ${tertiary};
    `}
`;

export const GreenCheckBoxForColor = styled.TouchableOpacity`
    border-radius: 30px;    
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    border-width: 3px;
    border-color: ${tertiary};
    background-color: ${green};
    ${(props) => props.selectedState == "Green" && `
        border-color: ${brand};
    `}
    ${(props) => props.selectedState !== "Green" && `
        border-color: ${tertiary};
    `}
`;

export const PurpleCheckBoxForColor = styled.TouchableOpacity`
    border-radius: 30px;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    border-width: 3px;
    border-color: ${tertiary};
    background-color: ${purple};
    ${(props) => props.selectedState == "Purple" && `
        border-color: ${brand};
    `}
    ${(props) => props.selectedState !== "Purple" && `
        border-color: ${tertiary};
    `}
`;

export const ProfileSelectMediaTypeHorizontalView = styled.View`
    border-color: ${darkest};
    border-bottom-width: 3px;
    padding-bottom: 5px;
    margin-top: 5px;
    width: 80%;
    align-items: center;
    flex-direction: row;
    align-self: center;
`;

export const ProfileSelectMediaTypeItem = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const ProfileSelectMediaTypeIconsBorder = styled.View`
    background-color: ${slightlyLighterGrey}
    border-color: ${slightlyLighterGrey}
    border-width: 3px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    ${(props) => props.selectedState == true && `
        background-color: ${darkLight}
    `}
`;

export const ProfileSelectMediaTypeIcons = styled.Image`
    resize-mode: contain;
    width: 35px;
    height: 35px;
`;

export const PollPostFrame = styled.TouchableOpacity`
    padding: 10px;
    margin-vertical: 10px;
    margin-left: 5%;
    margin-right: 5%;
    width: 90%;
    border-color: ${darkLight};
    border-width: 3px;
    align-items: center;
    border-radius: 30px;
`;

export const ViewScreenPollPostFrame = styled.View`
    padding: 10px;
    margin-vertical: 10px;
    margin-left: 5%;
    margin-right: 5%;
    width: 90%;
    border-color: ${darkLight};
    border-width: 3px;
    align-items: center;
    border-radius: 30px;
`;

export const ViewScreenPollPostCommentsFrame = styled.View`
    padding: 10px;
    margin-vertical: 10px;
    margin-left: 5%;
    margin-right: 5%;
    width: 90%;
    border-color: ${darkLight};
    border-width: 3px;
    align-items: center;
    border-radius: 30px;
`;


export const PollPostTitle = styled.Text`
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding-top: 15px;
    ${(props) => props.viewPage == true && `
        font-size: 35px;
    `}
    ${(props) => props.commentsTitle == true && `
        padding-bottom: 15px;
        padding-horizontal: 10px;
        border-color: ${darkest};
        border-bottom-width: 3px;
        border-radius: 20px;
    `}
`;

export const PollPostSubTitle = styled.Text`
    text-align: center;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    ${(props) => props.votesText == true && `
        margin-top: 5px;
    `}
    ${(props) => props.viewPage == true && `
        font-size: 15px;
        padding-bottom: 10px;
        border-color: ${darkest};
        border-bottom-width: 3px;
    `}
`;

export const PollBarOutline = styled.View`
    background-color: ${darkest};
    border-color: ${darkest};
    width: 90%;
    height: 20px;
    border-width: 3px;
    border-radius: 10px;
    flexDirection: row;
`;

export const PollBarItem = styled.View`
    background-color: ${brand};
    border-color: ${darkest};
    width: 16.6666666667%;
    height: 15px;
    border-width: 3px;
    border-radius: 10px;
    ${(props) => props.borderChange == 0 && `
        border-width: 0px;
    `}
`;

export const PollPostHorizontalView = styled.View`
    width: 100%;
    flexDirection: row; 
    align-items: center;
    justify-content: center;
    ${(props) => props.visible == false && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.visible == true && `
        width: 100%;
        flexDirection: row; 
        align-items: center;
        justify-content: center;
        left: 0px;
    `}
`;

export const AboveBarPollPostHorizontalView = styled.View`
    border-color: ${darkest};
    width: 90%;
    margin-top: 10px
    height: 20px;
    border-top-width: 3px;
    flexDirection: row;
    ${(props) => props.viewPage == true && `
        border-top-width: 0px;
    `}
`;

export const BottomPollPostHorizontalView = styled.View`
    border-color: ${darkest};
    margin-vertical: 10px;
    width: 90%;
    height: 20px;
    border-top-width: 3px;
    flexDirection: row;
    
`;

export const PollKeyViewOne = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
        margin-top: 10px;
    `}
`;

export const PollKeyViewTwo = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
    `}
`;

export const PollKeyViewThree = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.pollOptions == "Two" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
    `}
`;

export const PollKeyViewFour = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.pollOptions == "Two" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Three" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
    `}
`;

export const PollKeyViewFive = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.pollOptions == "Two" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Three" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Four" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
    `}
`;

export const PollKeyViewSix = styled.TouchableOpacity`
    padding-horizontal: 15px;
    flexDirection: row; 
    margin-vertical: 5px;
    width: 50%;
    align-items: center;
    justify-content: center;
    ${(props) => props.pollOptions == "Two" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Three" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Four" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.pollOptions == "Five" && `
        position: absolute;
        align-self: center;
        align-items: center;
        left: -30000px;
    `}
    ${(props) => props.viewPage == true && `
        width: 100%;
        margin-bottom: 10px;
    `}
`;

export const PollKeysCircle = styled.View`
    background-color: ${brand};
    width: 10px;
    height: 10px;
    border-radius: 30px;
    margin-horizontal: 5px;
    ${(props) => props.circleColor == "Red" && `
        background-color: ${red}
    `}
    ${(props) => props.circleColor == "Orange" && `
        background-color: ${orange}
    `}
    ${(props) => props.circleColor == "Yellow" && `
        background-color: ${yellow}
    `}
    ${(props) => props.circleColor == "Green" && `
        background-color: ${green}
    `}
    ${(props) => props.circleColor == "Purple" && `
        background-color: ${purple}
    `}
`;

export const PollPostIcons = styled.Image`
    margin-top: 10px;
    margin-right: 5px;
    width: 25px;
    height: 25px;
`;

export const PollBottomItem = styled.View`
    margin-top: 10px;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const CommentsContainer = styled.View`
    border-color: ${slightlyLighterGrey};
    border-top-width: 3px;
    border-bottom-width: 3px;
    width: 100%;

`;

export const CommentsHorizontalView = styled.View`
    width: 100%;
    flex-direction: row;
    ${(props) => props.bottomIcons == true && `
        margin-top: 5px;
        border-top-width: 3px;
        border-color: ${darkest};
    `}
    ${(props) => props.writeCommentArea == true && `
        align-items: center;
    `}
    ${(props) => props.belowWriteCommentArea == true && `
        align-items: center;
        margin-bottom: 10px;
        border-bottom-width: 3px;
        border-color: ${darkest};
    `}
`;

export const CommentsHorizontalViewItem = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

export const CommentsVerticalView = styled.View`
    flex-direction: column;
    text-align: left;
    width: 80%;
    ${(props) => props.alongLeft == true && `
        width: 20%;
        align-items: center;
        text-align: center;
    `}
    ${(props) => props.postComment == true && `
        margin-left: 20%;
    `}
    ${(props) => props.datePosted == true && `
        width: 60%;
    `}
`;

export const CommenterName = styled.Text`
    color: ${brand};
    border-color: ${darkest};
    font-size: 12px;
    padding-horizontal: 10px;
    border-bottom-width: 3px;
    text-align: left;
    margin-left: 5%;
    ${(props) => props.displayName == true && `
        color: ${tertiary};
        font-size: 16px;
        border-bottom-width: 0px;
    `}
`;

export const CommentText = styled.Text`
    color: ${midWhite};
    font-size: 10px;
    padding-horizontal: 10px;
    text-align: left;
    margin-bottom: 10px;
`;

export const CommenterIcon = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border-width: 3px;
    border-color: ${darkest};
    margin-bottom: 4px;
    margin-top: 10px;
`;

export const CommentIcons = styled.Image`
    margin-top: 4px;
    margin-horizontal: 12.5px;
    width: 25px;
    height: 25px;
    ${(props) => props.downVoteButton == true && `
        margin-top: 0px;
        margin-bottom: 10px;
    `}
`;

export const VoteTextBox = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const VoteText = styled.Text`
    color: ${midWhite};
    margin-vertical: 2px;
    font-size: 12px;
    text-align: center;
`;

export const SearchBarArea = styled.View`
    align-items: center;
    justify-content: center;
    width: 90%;
    margin-bottom: 10px;
`;

export const SearchHorizontalView = styled.View`
    height: 150px;
    width: 100%;
    flexDirection: row; 
    align-items: center;
    justify-content: center;
`;


export const SearchHorizontalViewItem = styled.View`
    border-color: ${darkest};
    flex: 1;
    align-items: center;
    text-align: center;
    border-top-width: 3px;
    border-bottom-width: 3px;
`;

export const SearchHorizontalViewItemCenter = styled.TouchableOpacity`
    border-color: ${darkest};
    flex: 1;
    align-items: center;
    text-align: center;
    border-radius: 5px;
    padding-vertical: 5px;
    border-top-width: 3px;
    border-bottom-width: 3px;
    border-right-width: 3px;
    border-left-width: 3px;
`;

export const SearchUserViewItemCenter = styled.TouchableOpacity`
    border-color: ${darkest};
    align-items: center;
    align-self: center;
    width: 40%;
    text-align: center;
    border-radius: 5px;
    padding-vertical: 5px;
    border-top-width: 3px;
    border-bottom-width: 3px;
    border-right-width: 3px;
    border-left-width: 3px;
`;

export const SearchSubTitle = styled.Text`
    text-align: center;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
    ${(props) => props.votesText == true && `
        margin-top: 5px;
    `}
    ${(props) => props.viewPage == true && `
        font-size: 15px;
        padding-bottom: 10px;
        border-color: ${darkest};
        border-bottom-width: 3px;
    `}
`;

export const SearchFrame = styled.TouchableOpacity`
    padding: 10px;
    margin-vertical: 10px;
    margin-left: 2%;
    margin-right: 2%;
    width: 96%;
    border-color: ${darkLight};
    border-width: 3px;
    align-items: center;
    border-radius: 30px;
`;

export const MultiMediaPostFrame = styled.TouchableOpacity`
    width: 100%;
    height 40px;
    text-align: center;
    align-items: center;
    justify-content: center;
    background-color: ${darkLight};
    ${(props) => props.TitleView == true && `
        margin-bottom: 10px;
        padding-top: ${StatusBarHeight + 10}px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    `}
    ${(props) => props.ImageView == true && `
        width: 100%
        height: 400px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 10px;
    `}
    ${(props) => props.PostingThreadImage == true && `
        width: 100%
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 10px;
    `}
    ${(props) => props.postOnProfile == true && `
        width: 90%
        align-self: center;
        padding-top: 0px;
        padding-bottom: 0px;
        padding-left: 0px;
        padding-right: 0px;
        border-radius: 20px;
    `}
`;

export const ImagePostFrame = styled.TouchableOpacity`
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 90%;
    border-color: ${darkLight};
    border-top-width: 3px;
    border-bottom-width: 3px;
    align-items: center;
    border-radius: 4px;
`;

export const ImagePostTextFrame = styled.View`
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 90%;
    border-color: ${darkLight};
    border-top-width: 3px;
    border-bottom-width: 3px;
    align-items: center;
    border-radius: 4px;
`;

export const PostCreatorIcon = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border-width: 3px;
    border-color: ${darkest};
    margin-bottom: 0px;
    margin-top: 10px;
`;

export const PostsHorizontalView = styled.View`
    flex: 1;
    flexDirection: row;
`;

export const PostsVerticalView = styled.View`
    flex-direction: column;
    text-align: left;
`
export const PostsIcons = styled.Image`
    width: 35px;
    height: 35px;
    resize-mode: contain;
`

export const PostsIconFrame = styled.TouchableOpacity`
    flex: 1; 
    height: 100%;
    alignItems: center;
    justifyContent: center;
`;

/* End of code merge from 31st October 2021 */

export const ListItem = styled.Text`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-vertical: 8px;
`;

export const ProfileBadgeItemUnderline = styled.View`
    width: 25px;
    height: 25px;
    transform: rotateX(75deg);
    margin-horizontal: 3px;
    margin-vertical: 6px;
    border-radius: 25px;
    background-color: ${tertiary};
    position: absolute;
    bottom: -13px;
    z-index: 20;
`;

export const Navigator_RightButton = styled.TouchableOpacity`
    position: absolute;
    right: 10px;
    padding-top: ${StatusBarHeight + 2}px;
    z-index: 10000;
`;