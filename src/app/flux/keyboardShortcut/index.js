import combokeys from '../../lib/combokeys';
import { actions as printingActions } from '../printing';
import { actions as editorActions } from '../editor';
import {
    ACTION_UPDATE_STATE
} from '../actionType';

export const actions = {
    updateState: (from, state) => {
        return {
            type: ACTION_UPDATE_STATE,
            from,
            state
        };
    },
    init: () => (dispatch, getState) => {
        const keyEventHandlers = {
            'DELETE': () => {
                const from = window.location.hash.split('/')[1];
                if (['laser', 'cnc'].includes(from)) {
                    dispatch(editorActions.removeSelectedModel(from));
                } else if (from === '3dp') {
                    const { displayedType } = getState().printing;
                    displayedType === 'model' && (dispatch(printingActions.removeSelectedModel()));
                }
            },
            'DUPLICATE': () => {
                const from = window.location.hash.split('/')[1];
                if (from === '3dp') {
                    const { displayedType } = getState().printing;
                    displayedType === 'model' && (dispatch(printingActions.duplicateSelectedModel()));
                } else {
                    dispatch(editorActions.duplicateSelectedModel(from));
                }
            },
            'JOG': (event, { direction }) => {
                const from = window.location.hash.split('/')[1];
                if (from === '3dp') {
                    const { layerCountDisplayed } = getState().printing;
                    dispatch(printingActions.showGcodeLayers(layerCountDisplayed + direction));
                }
            }
        };
        Object.keys(keyEventHandlers).forEach(eventName => {
            const callback = keyEventHandlers[eventName];
            combokeys.on(eventName, callback);
        });
    }
};

export default function reducer() {
    return {};
}
