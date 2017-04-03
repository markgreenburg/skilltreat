/* Import Tab Navigator to construct the router */
import { TabNavigator } from 'react-navigation';

/* Import screens */
import ElectiveNavigator from './ElectiveNavigator';
import CartNavigator from './CartNavigator';
import AccountNavigator from './AccountNavigator';

/* App layout is contained within a 3-tab react-navigation component */
const MainTab = TabNavigator({
    Treats: { screen: ElectiveNavigator },
    Cart: { screen: CartNavigator },
    Account: { screen: AccountNavigator },
});

export default MainTab;