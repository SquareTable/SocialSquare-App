import TopNavBar from "../components/TopNavBar";

export default function VotesViewPage({route}) {
    const {postFormat, postId} = route.params;

    alert(JSON.stringify(route.params))
    return (
        <TopNavBar screenName="Votes"/>
    )
}