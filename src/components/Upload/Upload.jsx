import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault();
        console.log(this.state.file);
        console.log(this.state.file.type);
        
        if (this.state.file && this.state.file.type === 'image/jpeg') {
            const formData = new FormData();
            formData.append('myImage', this.state.file);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            axios.post("/api/images/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
            });
        } else {
            window.alert("Only jpeg images are allowed.");
            this.setState({ file: null })
        }
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="file" name="myImage" onChange={this.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    username: state.authReducer.username,
    uri: state.authReducer.uri,
    error: state.authReducer.error
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
