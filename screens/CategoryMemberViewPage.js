import ItemAutoList from '../components/ItemAutoList';
import TopNavBar from '../components/TopNavBar';
import UserItem from '../components/Users/UserItem';
import useItemReducer from '../hooks/useItemReducer';

export default function CategoryMemberViewPage({route}) {
    const {categoryId} = route.params;
    const [state, dispatch] = useItemReducer();
    return (
        <>
            <TopNavBar screenName="Members"/>
            <ItemAutoList
                url="/tempRoute/getcategorymembers"
                centreIfNoItems={true}
                noItemsFoundText="This category has no members."
                noMoreItemsText="There are no more category members to show."
                extraPOSTData={{
                    categoryId
                }}
                extraProps={{
                    getItemLayout: (data, index) => {
                        return {
                            length: 70,
                            offset: 70 * index,
                            index
                        }
                    }
                }}
                DisplayComponent={UserItem}
                state={state}
                dispatch={dispatch}
                keyExtractor={(item) => item.secondId}
            />
        </>
    )
}