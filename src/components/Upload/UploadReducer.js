import { types } from './UploadActionTypes';

export const initialState = {
    message: ""
};

const uploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.UPLOAD_IMAGE:
            return { ...state };
        case types.UPLOAD_IMAGE_SUCCESS:
            return { ...state, message: action.success };
        case types.UPLOAD_IMAGE_FAILURE:
            return { ...state, message: action.error };
        default:
            return state;
    }
};

export default uploadReducer;
