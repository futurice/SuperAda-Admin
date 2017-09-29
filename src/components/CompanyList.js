import React from 'react';
import { connect } from 'react-redux';
import { Card, CardText, CardTitle, Paper } from 'material-ui';
import DraggableCompanyIcon from '../components/DraggableCompanyIcon';
import rest, { MOVE_COMPANY_SHORTCIRCUIT } from '../utils/rest';

const styles = {
  sideBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  logos: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'scroll',
    minHeight: 0,
  },
};

class CompanyList extends React.Component {
  constructor() {
    super();
    this.state = {
      companies: [],
    };
  }

  componentDidMount() {
    const { refresh } = this.props;
    refresh();
  }

  updateCompanyPosition = (id, x, y) => {
    const { update, updatePosition } = this.props;
    update(id, x, y);
  }

  render() {
    const { companies, target } = this.props;
    
    return (
      <Card style={styles.sideBar}>
        <CardTitle>Companies</CardTitle>
        <div style={styles.logos}>
          {companies.map((company, index) => (
            <DraggableCompanyIcon
              key={index}
              id={company.companyId}
              positionX={company.positionX}
              positionY={company.positionY}
              updateCompanyPosition={this.updateCompanyPosition}
              target={target}
            />
          ))}
        </div>
      </Card>
    );
  }
}

CompanyList.propTypes = {
  companies: React.PropTypes.array.isRequired,
  refresh: React.PropTypes.func.isRequired,
};

export default connect(
  state => {
    return {
      companies: state.companies.data,
    };
  },
  dispatch => ({
    refresh: () => {
      dispatch(rest.actions.companies());
    },
    update: (id, x, y) => {
      dispatch(
        rest.actions.company.put({companyId: id}, {
          body: JSON.stringify({
            x: x,
            y: y,
          }),
        }),
      );
      //short circuiting and moving company icon before response is received from the server
      dispatch({type: MOVE_COMPANY_SHORTCIRCUIT, id: id, x: x, y: y})
    },
  }),
)(CompanyList);
