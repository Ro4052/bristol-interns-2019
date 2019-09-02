import React from 'react';
import history from '../../../services/history';

export class UploadButton extends React.Component {
    goToUpload() {
        history.push('/upload');
    }

    render() {
        return (
            <div>
                <button onClick={this.goToUpload} data-cy="go-upload" type='button'>Upload</button>
            </div>
        );
    }
}

export default UploadButton;
