import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import TrashIcon from 'material-ui/svg-icons/action/delete';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import theme from '../utils/theme';
import rest from '../utils/rest';

import CreateTeamDialog from './CreateTeamDialog';
import DeleteTeamDialog from './DeleteTeamDialog';

import { injectIntl, FormattedMessage } from 'react-intl';

const styles = {
  deleteStyle: {
    width: '20px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing.desktopGutter,
  },
  fab: {
    position: 'fixed',
    right: 20,
    bottom: 20,
  }
};

class Teams extends React.Component {
  constructor() {
    super();

    this.state = {
      createDialogOpen: false,
      deleteDialogOpen: false,
      selectedTeam: {},
    };
  }

  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

  openDialog(dialogName, selectedTeam) {
    this.setState({
      [`${dialogName}DialogOpen`]: true,
      selectedTeam: selectedTeam || {}
    })
  }

  closeDialog(dialogName) {
    this.setState({
      [`${dialogName}DialogOpen`]: false
    })
  }

  render() {
    const { teams, createTeam, deleteTeam, intl: { formatMessage } } = this.props;
    const { deleteDialogOpen, createDialogOpen, selectedTeam } = this.state;

    return (
      <div>
        <CreateTeamDialog
          isOpen={createDialogOpen}
          submit={(team) => createTeam(team)}
          close={() => this.closeDialog('create')}
        />
        <DeleteTeamDialog
          isOpen={deleteDialogOpen}
          team={selectedTeam}
          submit={(team) => deleteTeam(team)}
          close={() => this.closeDialog('delete')}
        />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.deleteStyle} />
              <TableHeaderColumn>{formatMessage({id: 'teamName'})}</TableHeaderColumn>
              <TableHeaderColumn>{formatMessage({id: 'teamSlogan'})}</TableHeaderColumn>
              <TableHeaderColumn>{formatMessage({id: 'teamCompanyPoints'})}</TableHeaderColumn>
              <TableHeaderColumn>{formatMessage({id: 'teamQuizPoints'})}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              teams.map((team, index) => (
                <TableRow key={index} selectable={false}>
                  <TableRowColumn style={styles.deleteStyle}>
                    <IconButton onTouchTap={() => this.openDialog('delete', team)}>
                      <TrashIcon />
                    </IconButton>
                  </TableRowColumn>
                  <TableRowColumn>{team.teamName}</TableRowColumn>
                  <TableRowColumn>{team.description}</TableRowColumn>
                  <TableRowColumn>{team.points || 0}</TableRowColumn>
                  <TableRowColumn>{team.quizpoints || 0}</TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <FloatingActionButton onTouchTap={() => this.openDialog('create')} style={styles.fab}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

Teams.propTypes = {
  teams: React.PropTypes.array.isRequired,
  refresh: React.PropTypes.func.isRequired,
}

export default injectIntl(connect(
  (state) => ({
    teams: state.teams.data,
  }),
  (dispatch) => ({
    refresh: () => {
      dispatch(rest.actions.teams());
    },
    createTeam: (teamName) => {
      dispatch(rest.actions.teams.post(null, { body: JSON.stringify({ teamName }) }));
    },
    deleteTeam: (team) => {
      dispatch(rest.actions.team.delete({ teamId: team.teamId }));
    }
  }),
)(Teams))
