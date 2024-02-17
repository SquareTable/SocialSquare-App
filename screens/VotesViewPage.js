import { useState, useRef } from "react";
import ItemAutoList from "../components/ItemAutoList";
import OptionSelector from "../components/OptionSelector";
import TopNavBar from "../components/TopNavBar";
import UserItem from "../components/Users/UserItem";
import useItemReducer from "../hooks/useItemReducer";

export default function VotesViewPage({route}) {
    const {postFormat, postId} = route.params;
    const [upvoteState, dispatchUpvotes] = useItemReducer();
    const [downvoteState, dispatchDownvotes] = useItemReducer();

    const upvoteDataRef = useRef({postFormat, postId, voteType: 'Up'});
    const downvoteDataRef = useRef({postFormat, postId, voteType: 'Down'})


    const options = [
        'Upvotes',
        'Downvotes'
    ]

    const [optionSelected, setOption] = useState(options[0]);

    const upvoteSelected = optionSelected === 'Upvotes'

    return (
        <>
            <TopNavBar screenName="Votes"/>
            <OptionSelector selected={optionSelected} setOption={setOption} options={options}/>

            <ItemAutoList 
                extraPOSTData={upvoteSelected ? upvoteDataRef.current : downvoteDataRef.current}
                noItemsFoundText={`No ${optionSelected.toLowerCase()} were found`}
                centreIfNoItems={true}
                url={`/tempRoute/getvotedusersofpost`}
                DisplayComponent={UserItem}
                state={upvoteSelected ? upvoteState : downvoteState}
                dispatch={upvoteSelected ? dispatchUpvotes : dispatchDownvotes}
                extraProps={{
                    getItemLayout: (data, index) => {
                        return {
                            length: 70,
                            offset: 70 * index,
                            index
                        }
                    }
                }}
                keyExtractor={(item) => item.secondId}
                noMoreItemsText="No more items left"
            />
        </>
    )
}