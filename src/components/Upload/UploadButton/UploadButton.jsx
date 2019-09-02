import React from 'react';
import { withRouter } from "react-router";

export class UploadButton extends React.Component {
    goToUpload() {
        
    }

    render() {
        return (
            <div>
                <button onClick={() => this.props.history.push('/upload')} data-cy="go-upload" type='button'>Upload</button>
            </div>
        );
    }
}

export default withRouter(UploadButton);
