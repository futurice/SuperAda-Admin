import React from 'react';
import config from 'config';
import theme from '../utils/theme';
import MapBlueprint from '../components/MapBlueprint';
import CompanyList from '../components/CompanyList';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import ReactDOM from 'react-dom';

import {
  Paper
} from 'material-ui';

const styles = {
  container: {
    margin: theme.spacing.desktopGutter,
    display: 'flex',
    flex: '0 1 450px',
    flexDirection: 'row',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: '0 1 auto',
  },
}

class Map extends React.Component {
  constructor() {
    super();
    this.state = {}
  }

  handleLoaded = () => {
    console.log('handling image loaded')
    var rect = ReactDOM.findDOMNode(this.refs.mapBlueprint).getBoundingClientRect();
    console.log('', rect)
    this.setState({mapBlueprint: rect})
  }

  render() {
    return (
      <Paper style={styles.container}> 
        <div style={styles.content}>
          <MapBlueprint ref="mapBlueprint" handleLoaded={this.handleLoaded}/>
          <CompanyList target={this.state.mapBlueprint}/>
        </div>
      </Paper>
    );
  }
}

export default (DragDropContext(HTML5Backend)(Map))