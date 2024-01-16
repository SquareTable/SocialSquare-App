import ItemAutoList from "../components/ItemAutoList";
import TopNavBar from "../components/TopNavBar";
import UserItem from "../components/Users/UserItem";

export default function VotesViewPage({route}) {
    const {postFormat, postId} = route.params;

    return (
        <>
            <TopNavBar screenName="Votes"/>
            <ItemAutoList 
                extraPOSTData={{postFormat, postId}}
                noItemsFoundText="Could not find votes"
                centreIfNoItems={true}
                url="/tempRoute/getvotedusersofpost"
                DisplayComponent={UserItem}
            />
        </>
    )
}