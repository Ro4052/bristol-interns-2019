import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { Upload } from './Upload';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);

const emptyState = { uploadReducer: { message: '' } };
const emptyStore = mockStore(emptyState);

const uploadImage = jest.fn();
const uploadImageFailure = jest.fn();

describe('on pressing the upload button', () => {
    it('fails to upload if no image was selected', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Upload uploadImage={uploadImage} uploadImageFailure={uploadImageFailure} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'upload-form' }).simulate('submit');
        expect(uploadImageFailure).toHaveBeenCalled();
        uploadImageFailure.mockRestore();
    });
    it('successfully uploads if an image was selected', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Upload uploadImage={uploadImage} uploadImageFailure={uploadImageFailure} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'upload-input' }).simulate('change', { preventDefault: () => {}, target: { files: [{type: 'image/jpeg'}] } });
        wrapper.find({ 'data-cy': 'upload-form' }).simulate('submit');
        expect(uploadImage).toHaveBeenCalled();
        uploadImage.mockRestore();
    });
    it('fails to upload if an image of the wrong type was selected', () => {
        const wrapper = mount(
            <Provider store={emptyStore}>
                <Upload uploadImage={uploadImage} uploadImageFailure={uploadImageFailure} />
            </Provider>
        );
        wrapper.find({ 'data-cy': 'upload-input' }).simulate('change', { preventDefault: () => {}, target: { files: [{type: 'image/svg'}] } });
        wrapper.find({ 'data-cy': 'upload-form' }).simulate('submit');
        expect(uploadImageFailure).toHaveBeenCalled();
        uploadImageFailure.mockRestore();
    });
});
