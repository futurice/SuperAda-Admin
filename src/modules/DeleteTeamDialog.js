import React from 'react'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class DeleteTeamDialog extends React.Component {
  render () {
    const { submit, close, isOpen, team } = this.props;

    return (
      <Dialog
        title={`Delete Team '${ team.teamName }'?`}
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={close}
          />,
          <FlatButton
            label="Delete"
            secondary={true}
            keyboardFocused={true}
            onTouchTap={() => (submit(team) || close())}
          />,
        ]}
        modal={false}
        open={isOpen}
        onRequestClose={close}
      >
        <div>
          Are you sure you want to delete team '{ team.teamName }'?
          Note that all of their points will be lost forever!
        </div>
      </Dialog>
    );
  }
}

DeleteTeamDialog.propTypes = {
  submit: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
}

export default DeleteTeamDialog;
