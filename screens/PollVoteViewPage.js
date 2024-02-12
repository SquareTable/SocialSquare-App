import ItemAutoList from '../components/ItemAutoList';
import TopNavBar from '../components/TopNavBar';
import useItemReducer from '../hooks/useItemReducer';
import UserItem from "../components/Users/UserItem";

export default function PollVoteViewPage({route}) {
    const {pollId, pollOption} = route.params;
    const [state, dispatch] = useItemReducer();

    return (
        <>
            <TopNavBar screenName={`Votes on Option ${pollOption}`}/>
            <ItemAutoList
                noItemsFoundText="No votes could be found."
                centreIfNoItems
                url="/tempRoute/getpollvoteusers"
                extraPOSTData={{
                    pollId,
                    pollOption
                }}
                DisplayComponent={UserItem}
                extraProps={{
                    getItemLayout: (data, index) => {
                        return {
                            length: 70,
                            offset: 70 * index,
                            index
                        }
                    }
                }}
                state={state}
                dispatch={dispatch}
                noMoreItemsText="No more votes left."
            />
        </>
    )
}