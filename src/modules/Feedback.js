import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import TrashIcon from 'material-ui/svg-icons/action/delete';

import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import theme from '../utils/theme';
import rest from '../utils/rest';

import DialogWithButtons from '../components/DialogWithButtons';

import { injectIntl, FormattedMessage } from 'react-intl';

import ReactImageFallback from 'react-image-fallback';
import config from 'config';

const styles = {
  deleteStyle: {
    width: '20px'
  },
  logoStyle: {
    width: 32,
    height: 'auto',
    paddingVertical: 'auto',
    paddingRight: 0
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing.desktopGutter,
  },
  bold: {
    fontWeight: 'bold',
  },
  answer: {
    paddingBottom: 10,
  },
};

class Feedback extends React.Component {
  constructor() {
    super();

    this.state = {
      viewDialogOpen: false,
      deleteDialogOpen: false,
      selectedFeedback: {},
    };
  }

  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

  openDialog(dialogName, selectedFeedback) {
    this.setState({
      [`${dialogName}DialogOpen`]: true,
      selectedFeedback: selectedFeedback || {}
    })
  }

  closeDialog(dialogName) {
    this.setState({
      [`${dialogName}DialogOpen`]: false
    })
  }

  render() {
    const { feedback, deleteFeedback, intl: { formatMessage } } = this.props;
    const { deleteDialogOpen, viewDialogOpen, selectedFeedback } = this.state;

    const feedbackDescription = selectedFeedback && selectedFeedback.answers
    ? selectedFeedback.answers.map((answer, i) => (
      <div key={i}>
        <div style={styles.bold}> { answer.questionText } </div>
        <div style={styles.answer}> { answer.answer } </div>
      </div>
    ))
    : null;

    return (
      <div>
        <DialogWithButtons
          title={formatMessage({id: 'viewFeedbackWithName'}, {name: selectedFeedback.teamName})}
          cancelAction={formatMessage({id: 'cancel'})}
          submitAction={formatMessage({id: 'ok'})}
          description={feedbackDescription}
          isOpen={viewDialogOpen}
          submit={() => console.log('viewFeedback dialog closed')}
          close={() => this.closeDialog('view')}
        />
        <DialogWithButtons
          title={formatMessage({id: 'deleteFeedbackWithName'}, {name: selectedFeedback.teamName})}
          cancelAction={formatMessage({id: 'cancel'})}
          submitAction={formatMessage({id: 'deleteFeedback'})}
          description={formatMessage({id: 'deleteFeedbackConfirmation'}, {name: selectedFeedback.teamName})}
          isOpen={deleteDialogOpen}
          submit={() => deleteFeedback(selectedFeedback)}
          close={() => this.closeDialog('delete')}
        />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.deleteStyle} />
              <TableRowColumn style={styles.logoStyle}></TableRowColumn>
              <TableHeaderColumn>{formatMessage({id: 'teamName'})}</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              feedback.map((thisFeedback, index) => (
                <TableRow  key={index} selectable={true}>
                  <TableRowColumn style={styles.deleteStyle}>
                    <IconButton onTouchTap={() => this.openDialog('delete', thisFeedback)}>
                      <TrashIcon />
                    </IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={styles.logoStyle}>
                    <ReactImageFallback
                      src={`${config.API_ROOT}/public/team${thisFeedback.teamId}.png`} style={styles.logoStyle}
                      fallbackImage={require("../../assets/no_profile_pic.png")}
                    />
                  </TableRowColumn>
                  <TableRowColumn>{thisFeedback.teamName}</TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton
                      label={ formatMessage({id: 'showFeedback'}) }
                      primary={true}
                      onTouchTap={() => this.openDialog('view', thisFeedback)}
                    />
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

Feedback.propTypes = {
  feedback: React.PropTypes.array.isRequired,
  refresh: React.PropTypes.func.isRequired,
}

export default injectIntl(connect(
  (state) => ({
    feedback: state.feedback.data,
  }),
  (dispatch) => ({
    refresh: () => {
      dispatch(rest.actions.allFeedback());
    },
    deleteFeedback: (feedback) => {
      dispatch(rest.actions.feedback.delete({ teamId: feedback.teamId }));
    }
  }),
)(Feedback))
