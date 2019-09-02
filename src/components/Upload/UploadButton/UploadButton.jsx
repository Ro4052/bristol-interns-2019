import React from 'react';

export function UploadButton(props) {
    return (
        <div>
            <button onClick={() => props.history.push('/upload')} data-cy="go-upload" type='button'>Upload</button>
        </div>
    );
}

export default UploadButton;
