import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  preview: {
    padding: 32,
    width: 128,
    height: 128,
    borderRadius: '50%'
  }
}

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: ''
    };
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
      this.props.setImageUrl(file);
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img style={styles.preview} src={imagePreviewUrl} />);
    }

    return (
      <div className="previewComponent">
        <div>
          {$imagePreview}
        </div>
        <div>
          <RaisedButton
            label={this.props.label}
            primary={true}
            onClick={() => this.fileUpload.click()}
            />
          <input
            type="file"
            ref={(fileUpload) => {this.fileUpload = fileUpload}}
            style={{display: 'none'}}
            onChange={(e)=>this._handleImageChange(e)} />
        </div>
      </div>
    )
  }
}

ImageUpload.propTypes = {
  label: React.PropTypes.string.isRequired,
  setImageUrl: React.PropTypes.func.isRequired,
}

export default ImageUpload;
