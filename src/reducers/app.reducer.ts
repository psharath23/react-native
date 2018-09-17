import _ from 'lodash';
import AppActions from './../actions/app.actions';
import { IAppState } from './../interfaces/app.interface';
const initialState: IAppState = {
    SelectedApp: '',
    InTask: false
};
export function App(state: IAppState = initialState, action: any) {
    switch (action.type) {
        case AppActions.IN_TASK: {
            return _.extend({}, state, { InTask: action.payload });
        }
        default:
            return state;
    }
}
export default App;
