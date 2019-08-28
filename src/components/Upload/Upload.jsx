import React from 'react';
import { connect } from 'react-redux';
import { uploadImage, uploadImageFailure } from './UploadActions';
import styles from './Upload.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

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
        if (!this.state.file) {
            this.props.uploadImageFailure("You need to select an image first.");
            this.setState({ file: null })
        } else if (this.state.file && ['image/jpeg', 'image/png'].includes(this.state.file.type)) {
            const formData = new FormData();
            formData.append('image', this.state.file);
            this.props.uploadImage(formData);
        } else {
            this.props.uploadImageFailure("Only jpeg or png images are allowed.");
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
                <form className={styles.uploadForm} data-cy='upload-form' onSubmit={this.sendImageUpload}>
                    <div className={cx(styles.fileUpload, { active: this.state.file })}>
                        <div className={styles.fileSelect}>
                            <div className={styles.fileSelectButton} id="fileName">Choose File</div>
                            <div className={styles.fileSelectName} id="noFile">{this.state.file ? this.state.file.name : "No file chosen..."}</div> 
                            <input data-cy='upload-input' type="file" name="chooseFile" id="chooseFile" onChange={this.onChange} />
                        </div>
                    </div>
                    <button data-cy='upload-button' type="submit">Upload</button>
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
