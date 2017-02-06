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
    width: 20
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
    const { companies, createCompany, deleteCompany, intl: { formatMessage } } = this.props;
    const { deleteDialogOpen, createDialogOpen, selectedCompany } = this.state;

    return (
      <div>
        <DialogWithButtons
          title={formatMessage({id: 'addCompany'})}
          textField={{
            label: formatMessage({id: 'companyName'}),
            textAfter: formatMessage({id: 'companyNameNote'}),
          }}
          imageUpload={{
            label: formatMessage({id: 'companyLogo'})
          }}
          submitAction={formatMessage({id: 'addCompany'})}
          description={formatMessage({id: 'addCompanyDescription'})}
          isOpen={createDialogOpen}
          submit={(company) => createCompany(company)}
          close={() => this.closeDialog('create')}
        />
        <DialogWithButtons
          title={formatMessage({id: 'deleteCompanyWithName'}, {name: selectedCompany.companyName})}
          submitAction={formatMessage({id: 'deleteCompany'})}
          description={formatMessage({id: 'deleteCompanyConfirmation'}, {name: selectedCompany.companyName})}
          isOpen={deleteDialogOpen}
          submit={() => deleteCompany(selectedCompany)}
          close={() => this.closeDialog('delete')}
        />
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={styles.deleteStyle} />
              <TableHeaderColumn>{formatMessage({id: 'company'})}</TableHeaderColumn>
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
                  <TableRowColumn style={styles.logoStyle}>
                    <ReactImageFallback
                      src={`${config.API_ROOT}/public/company${company.companyId}.png`} style={styles.logoStyle}
                      fallbackImage="no_company_pic.png"
                    />
                  </TableRowColumn>
                  <TableRowColumn>{company.companyName}</TableRowColumn>
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

export default injectIntl(connect(
  (state) => ({
    companies: state.companies.data,
  }),
  (dispatch) => ({
    refresh: () => {
      dispatch(rest.actions.companies());
    },
    createCompany: (data) => {
      const companyName = data.value;
      const file = data.file;

      const reader = new FileReader();

      reader.onload = (e) => {
        dispatch(rest.actions.companies.post(null, {
          body: JSON.stringify({
            companyName,
            logo: e.currentTarget.result,
          })
        }));
      };

      reader.readAsDataURL(file);
    },
    deleteCompany: (company) => {
      dispatch(rest.actions.company.delete({ companyId: company.companyId }));
    }
  }),
)(Companies))
