import { types } from './UploadActionTypes';
import axios from "axios";

const axiosInstance = axios.create({ validateStatus: status => (status >= 200 && status < 500) });

export const uploadImage = formData => dispatch => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axiosInstance.post("/api/images/upload", formData, config)
    .then(res => {
        if (res.status === 200) {
            dispatch(uploadImageSuccess("File was uploaded successfully!"));
        } else {
            throw new Error(res.data.message);
        }
    }).catch((error) => {
        dispatch(uploadImageFailure(error.message));
    });
}

export const uploadImageSuccess = success => ({
    type: types.UPLOAD_IMAGE_SUCCESS,
    success
});

export const uploadImageFailure = error => ({
    type: types.UPLOAD_IMAGE_FAILURE,
    error
});
