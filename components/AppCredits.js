import React from 'react';
import {Text} from 'react-native'
import { useTheme } from '@react-navigation/native';

const AppCredits = () => {
    const {colors} = useTheme();
    return(
        <>
            <Text style={{color: colors.tertiary, fontSize: 24, textAlign: 'center'}}>© SquareTable 2023</Text>
            <Text style={{color: colors.tertiary, fontSize: 24, textAlign: 'center', marginBottom: 10}}>All Rights Reserved</Text>
            <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 3}}>Made by Sebastian Webster and Kovid Dev</Text>
            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginBottom: 5}}>With huge help from Didula Semasinghe, Jacob Bowden, and Andrew Gossen</Text>
        </>
    );
}

export default AppCredits