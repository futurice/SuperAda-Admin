import React from 'react'

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import ImageUpload from '../components/ImageUpload'

class DialogWithButtons extends React.Component {
  constructor(props) {
   super(props);

   this.state = {
     value: '',
     file: null
   };
 }

  keyDown = (event) => {
    const { submit, close } = this.props;

    if (event.keyCode == 13) {
      submit(this.state)
      close()
    }
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  setImageUrl = (file) => {
    this.setState({
      file
    })
  };

  render () {
    const {
      title,
      imageUpload,
      cancelAction,
      submitAction,
      submit,
      close,
      isOpen,
      description,
      textField
    } = this.props;

    return (
      <Dialog
        title={ title }
        actions={[
          <FlatButton
            label={ cancelAction }
            primary={true}
            onTouchTap={close}
          />,
          <FlatButton
            label={ submitAction }
            primary={true}
            keyboardFocused={true}
            disabled={(textField && !this.state.value) || (imageUpload && !this.state.file)}
            onTouchTap={() => {
              submit(this.state);
              close();
            }}
          />,
        ]}
        modal={false}
        open={isOpen}
        onRequestClose={close}
        autoScrollBodyContent={true}
      >
        <div>
          { description }
        </div>

        { textField ?
          <div>
            <TextField
              floatingLabelText={textField.label}
              value={this.state.value}
              onChange={this.handleChange}
              autoFocus={true}
              onKeyDown={this.keyDown}
            />
          </div>
          :
          null
        }

        <p>
          { textField && textField.textAfter }
        </p>

        { imageUpload ?
          <div>
            <ImageUpload setImageUrl={this.setImageUrl} label={imageUpload.label}/>
          </div>
          :
          null
        }

        <p>
          { imageUpload && imageUpload.textAfter }
        </p>

      </Dialog>
    );
  }
}

DialogWithButtons.propTypes = {
  textField: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    textAfter: React.PropTypes.string,
  }),
  imageUpload: React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    textAfter: React.PropTypes.string,
  }),
  title: React.PropTypes.string.isRequired,
  cancelAction: React.PropTypes.string.isRequired,
  submitAction: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  submit: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
}

export default DialogWithButtons;
