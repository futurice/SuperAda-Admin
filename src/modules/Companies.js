import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import TrashIcon from 'material-ui/svg-icons/action/delete';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import theme from '../utils/theme';
import HomeCard from '../components/HomeCard';
import rest from '../utils/rest';

import DialogWithButtons from '../components/DialogWithButtons';

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
    position: 'absolute',
    right: 20,
    bottom: 20,
  }
};

class Companies extends React.Component {
  constructor() {
    super();

    this.state = {
      createDialogOpen: false,
      deleteDialogOpen: false,
      selectedCompany: {},
    };
  }

  componentDidMount() {
    const { refresh } = this.props;

    refresh();
  }

  openDialog(dialogName, selectedCompany) {
    this.setState({
      [`${dialogName}DialogOpen`]: true,
      selectedCompany: selectedCompany || {}
    })
  }

  closeDialog(dialogName) {
    this.setState({
      [`${dialogName}DialogOpen`]: false
    })
  }

  render() {
    const { companies, createCompany, deleteCompany } = this.props;
    const { deleteDialogOpen, createDialogOpen, selectedCompany } = this.state;

    return (
      <div>
        <DialogWithButtons
          title='Add company'
          textField={{
            label: 'Company name',
            textAfter: 'Note that this will be the (case-sensitive!) login name for the company.',
          }}
          submitAction='Add company'
          description='Create a new company which will participate in the event:'
          isOpen={createDialogOpen}
          submit={(company) => createCompany(company)}
          close={() => this.closeDialog('create')}
        />
        <DialogWithButtons
          title={`Delete company '${ selectedCompany.companyName }'?`}
          submitAction='Delete'
          description={`Are you sure you want to delete the '${ selectedCompany.companyName }' company? Note that all points they have given to teams will also be lost!`}
          isOpen={deleteDialogOpen}
          submit={() => deleteCompany(selectedCompany)}
          close={() => this.closeDialog('delete')}
        />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.deleteStyle} />
              <TableHeaderColumn>Company name</TableHeaderColumn>
              <TableHeaderColumn>Slogan</TableHeaderColumn>
              <TableHeaderColumn>Total points</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              companies.map((company, index) => (
                <TableRow key={index} selectable={false}>
                  <TableRowColumn style={styles.deleteStyle}>
                    <IconButton onTouchTap={() => this.openDialog('delete', company)}>
                      <TrashIcon />
                    </IconButton>
                  </TableRowColumn>
                  <TableRowColumn>{company.companyName}</TableRowColumn>
                  <TableRowColumn>{company.description}</TableRowColumn>
                  <TableRowColumn>{company.points || 0}</TableRowColumn>
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

Companies.propTypes = {
  companies: React.PropTypes.array.isRequired,
  refresh: React.PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    companies: state.companies.data,
  }),
  (dispatch) => ({
    refresh: () => {
      dispatch(rest.actions.companies());
    },
    createCompany: (companyName) => {
      dispatch(rest.actions.companies.post(null, { body: JSON.stringify({ companyName }) }));
    },
    deleteCompany: (company) => {
      dispatch(rest.actions.company.delete({ companyId: company.companyId }));
    }
  }),
)(Companies)
