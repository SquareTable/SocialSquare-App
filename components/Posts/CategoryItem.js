import { PureComponent } from 'react';
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

class CategoryItemClass extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SearchFrame onPress={() => this.props.onPressFunction ? this.props.onPressFunction(this.props.categoryTitle, this.props.allowScreenShots, this.props.categoryId) : this.props.navigation.navigate("CategoryViewPage", {categoryTitle: this.props.categoryTitle, NSFL: this.props.NSFL, NSFW: this.props.NSFW, allowScreenShots: (this.props.allowScreenShots != undefined ? this.props.allowScreenShots : true), categoryId: this.props.categoryId})}>
                <Avatar resizeMode="cover" searchPage={true} source={{uri: this.props.image != undefined && this.props.image != null && this.props.image != '' ? this.props.image : SocialSquareLogo_B64_png}} />
                {this.props.NSFW == false && (
                    <View>
                        {this.props.NSFL == false && (
                            <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                        )}
                        {this.props.NSFL == true && (
                            <View style={{flexDirection: 'row'}}>
                                <SubTitle searchResTitle={true} style={{color: this.props.colors.red}}>(NSFL) </SubTitle>
                                <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                            </View>
                        )}
                    </View>
                )}
                {this.props.NSFW == true && (
                    <View style={{flexDirection: 'row'}}>
                        <SubTitle searchResTitle={true} style={{color: this.props.colors.red}}>(NSFW) </SubTitle>
                        <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                    </View>
                )}
                <SubTitle style={{color: this.props.colors.tertiary, textAlign: 'center'}} searchResTitleDisplayName={true}>{this.props.categoryDescription}</SubTitle>
                <SubTitle searchResTitleDisplayName={true} style={{color: this.props.colors.brand}}>{this.props.categoryTags}</SubTitle>
                <SearchHorizontalView>
                    <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> Members </SearchSubTitle>
                        <ProfIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                        {this.props.members == 0 && ( 
                            <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> 0 </SearchSubTitle>
                        )}
                        {this.props.members !== 0 && ( 
                            <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> {this.props.members} </SearchSubTitle>
                        )}
                    </SearchHorizontalViewItemCenter>
                    <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> Date Created </SearchSubTitle>
                        <ProfIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> {getTimeFromUTCMS(this.props.datePosted)} </SearchSubTitle>
                    </SearchHorizontalViewItemCenter>
                </SearchHorizontalView>
            </SearchFrame>
        )
    }
}

const CategoryItem = ({categoryTitle, categoryDescription, members, categoryTags, image, NSFW, NSFL, datePosted, categoryId, allowScreenShots, onPressFunction}) => {
    const {colors} = useTheme();
    const navigation = useNavigation();

    return <CategoryItemClass navigation={navigation} colors={colors} categoryTitle={categoryTitle} categoryDescription={categoryDescription} members={members} categoryTags={categoryTags} image={image} NSFW={NSFW} NSFL={NSFL} datePosted={datePosted} categoryId={categoryId} allowScreenShots={allowScreenShots} onPressFunction={onPressFunction}/>
};

export default CategoryItem;