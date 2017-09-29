import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import config from 'config';

const styles = {
  map: {
    width: '600',
  },
}

const spec = {
  drop(props, monitor, component) {
    var rect = ReactDOM.findDOMNode(component)
      .getBoundingClientRect();
      
    return {
      sourceOffset: monitor.getSourceClientOffset(),
      offsetDifference: monitor.getDifferenceFromInitialOffset(),
      targetLeft: rect.left,
      targetTop: rect.top,
      targetWidth: rect.width,
      targetHeight: rect.height
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class MapBlueprint extends React.Component {
  render() {
    const { connectDropTarget, handleLoaded } = this.props;
    return connectDropTarget(
      <img style={styles.map} src={`${config.API_ROOT}/public/map_template.png`} onLoad={handleLoaded}/>
    );
  }
}

export default DropTarget('companyIcon', spec, collect)(MapBlueprint);