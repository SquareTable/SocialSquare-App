import { useState, useContext } from 'react';
import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext';

//Can add more functionalty later, but for now this will just return the amount of logged in users

const useAccounts = () => {
    const [allCredentialsStoredList, setAllCredentialsStoredList] = useContext(AllCredentialsStoredContext)

    return {
        loggedInAccounts: allCredentialsStoredList.length
    }
}

export default useAccounts;