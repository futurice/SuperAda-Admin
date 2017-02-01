import React from 'react'

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class CreateTeamDialog extends React.Component {
  constructor(props) {
   super(props);

   this.state = {
     value: '',
   };
 }

  keyDown = (event) => {
    const { submit, close } = this.props;

    if (event.keyCode == 13) {
      submit(this.state.value) || close()
    }
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render () {
    const { submit, close, isOpen } = this.props;

    return (
      <Dialog
        title="Add Team"
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={close}
          />,
          <FlatButton
            label="Add Team"
            primary={true}
            keyboardFocused={true}
            disabled={!this.state.value}
            onTouchTap={() => (submit(this.state.value) || close())}
          />,
        ]}
        modal={false}
        open={isOpen}
        onRequestClose={close}
      >
        <div>
          Create a new team which will participate in the event:
        </div>

        <div>
          <TextField
            floatingLabelText="Team name"
            value={this.state.value}
            onChange={this.handleChange}
            autoFocus={true}
            onKeyDown={this.keyDown}
          />
        </div>

        <p>
          Note that this will be the (case-sensitive!) login name for the team.
        </p>

      </Dialog>
    );
  }
}

CreateTeamDialog.propTypes = {
  submit: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
}

export default CreateTeamDialog;
