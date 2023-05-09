import {useContext} from 'react';
import { ServerUrlContext } from '../components/ServerUrlContext';
import axios from 'axios';

const useSharedCode = () => {
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)

    const getBase64Image = (imageKey) => {
        //Coming soon
    }

    const allSettled = (promises) => {
        return Promise.all(promises.map(promise => promise
            .then(value => ({ status: 'fulfilled', value }))
            .catch(reason => ({ status: 'rejected', reason }))
        ));
    }

    return {
        getBase64Image,
        PromiseAllSettled: allSettled
    }
}

export default useSharedCode