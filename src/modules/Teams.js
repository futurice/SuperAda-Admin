import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import TrashIcon from 'material-ui/svg-icons/action/delete';

import FloatingActionButton from 'material-ui/FloatingActionButton';
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
        <DialogWithButtons
          title={formatMessage({id: 'addTeam'})}
          textField={{
            label: formatMessage({id: 'teamName'}),
            textAfter: formatMessage({id: 'teamNameNote'}),
          }}
          submitAction={formatMessage({id: 'addTeam'})}
          description={formatMessage({id: 'addTeamDescription'})}
          isOpen={createDialogOpen}
          submit={(team) => createTeam(team)}
          close={() => this.closeDialog('create')}
        />
        <DialogWithButtons
          title={formatMessage({id: 'deleteTeamWithName'}, {name: selectedTeam.teamName})}
          submitAction={formatMessage({id: 'deleteTeam'})}
          description={formatMessage({id: 'deleteTeamConfirmation'}, {name: selectedTeam.teamName})}
          isOpen={deleteDialogOpen}
          submit={() => deleteTeam(selectedTeam)}
          close={() => this.closeDialog('delete')}
        />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.deleteStyle} />
              <TableRowColumn style={styles.logoStyle}></TableRowColumn>
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
                  <TableRowColumn style={styles.logoStyle}>
                    <ReactImageFallback
                      src={`${config.API_ROOT}/public/team${team.teamId}.png`} style={styles.logoStyle}
                      fallbackImage={require("../../assets/no_profile_pic.png")}
                    />
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
    createTeam: (data) => {
      dispatch(rest.actions.teams.post(null, { body: JSON.stringify({ teamName: data.value }) }));
    },
    deleteTeam: (team) => {
      dispatch(rest.actions.team.delete({ teamId: team.teamId }));
    }
  }),
)(Teams))
