import { useNavigation, useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png.js';
import {
    SearchFrame,
    Avatar,
    SubTitle,
    SearchHorizontalView,
    SearchSubTitle,
    ProfIcons,
    SearchHorizontalViewItemCenter
} from '../../screens/screenStylings/styling.js';
import { View } from 'react-native';
import { getTimeFromUTCMS } from '../../libraries/Time.js';

const CategoryItem = ({categoryTitle, categoryDescription, members, categoryTags, image, NSFW, NSFL, datePosted, categoryId}) => {
    const {colors} = useTheme();
    const navigation = useNavigation()
    return (
        <SearchFrame onPress={() => navigation.navigate("CategoryViewPage", {categoryTitle, NSFW, NSFL, categoryId})}>
            <View style={{paddingHorizontal: '50%'}}>
            </View>
            <Avatar resizeMode="cover" searchPage={true} source={{uri: image != null || '' ? image : SocialSquareLogo_B64_png}} />
            {NSFW == false && (
                <View>
                    {NSFL == false && (
                        <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                    )}
                    {NSFL == true && (
                        <View style={{flexDirection: 'row'}}>
                            <SubTitle searchResTitle={true} style={{color: colors.red}}>(NSFL) </SubTitle>
                            <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                        </View>
                    )}
                </View>
            )}
            {NSFW == true && (
                <View style={{flexDirection: 'row'}}>
                    <SubTitle searchResTitle={true} style={{color: colors.red}}>(NSFW) </SubTitle>
                    <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                </View>
            )}
            <SubTitle style={{color: colors.tertiary}} searchResTitleDisplayName={true}>{categoryDescription}</SubTitle>
            <SubTitle searchResTitleDisplayName={true} style={{color: colors.brand}}>{categoryTags}</SubTitle>
            <SearchHorizontalView>
                <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> Members </SearchSubTitle>
                    <ProfIcons style={{flex: 1}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                    {members == 0 && ( 
                        <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> 0 </SearchSubTitle>
                    )}
                    {members !== 0 && ( 
                        <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> {members} </SearchSubTitle>
                    )}
                </SearchHorizontalViewItemCenter>
                <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> Date Created </SearchSubTitle>
                    <ProfIcons style={{flex: 1}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> {getTimeFromUTCMS(datePosted)} </SearchSubTitle>
                </SearchHorizontalViewItemCenter>
            </SearchHorizontalView>
        </SearchFrame>
    )
};

export default CategoryItem;