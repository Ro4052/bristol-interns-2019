import React from 'react';
import { connect } from 'react-redux';
import { uploadImage, uploadImageFailure } from './UploadActions';
import styles from './Upload.module.css';

export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this.sendImageUpload = this.sendImageUpload.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    sendImageUpload(e){
        e.preventDefault();        
        if (this.state.file && this.state.file.type === 'image/jpeg') {
            const formData = new FormData();
            formData.append('image', this.state.file);
            this.props.uploadImage(formData);
        } else {
            this.props.uploadImageFailure("Only jpeg images are allowed.");
            this.setState({ file: null })
        }
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    render() {        
        return (
            <div className={styles.uploadSection}>
                {this.props.message && <span className={styles.uploadMessage}>{this.props.message}</span>}
                <form className={styles.uploadForm} onSubmit={this.sendImageUpload}>
                    <input type="file" name="image" onChange={this.onChange} />
                    <button type="submit">Upload</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    message: state.uploadReducer.message
});

const mapDispatchToProps = dispatch => ({
    uploadImage: (formData) => dispatch(uploadImage(formData)),
    uploadImageFailure: (error) => dispatch(uploadImageFailure(error)) 
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
