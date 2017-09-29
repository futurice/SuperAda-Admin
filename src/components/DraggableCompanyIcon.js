import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import config from 'config';
import ReactDOM from 'react-dom';

const styles = {
  logo: {
    width: 32,
    overflow: 'hidden',
  },
};

const spec = {
  beginDrag(props) {
    return { };
  },
  endDrag(props, monitor, component) {
    var { left, top } = component.state.style;
    
    if(monitor.didDrop()) {
      var result = monitor.getDropResult();
      var {sourceOffset, offsetDifference, targetLeft, targetTop, targetWidth, targetHeight} = result;
  
      var leftAbsolute = left === undefined ? sourceOffset.x : left + offsetDifference.x;
      leftAbsolute = leftAbsolute < targetLeft ? (targetLeft+1) : leftAbsolute;

      var topAbsolute = top === undefined ? sourceOffset.y : top + offsetDifference.y;
      topAbsolute = topAbsolute < targetTop ? (targetTop+1) : topAbsolute;

      left = (leftAbsolute - targetLeft) / targetWidth;
      top = (topAbsolute - targetTop) / targetHeight;
    } else {
      component.resetState();
      left = 0;
      top = 0;
    }
    const { updateCompanyPosition, id } = component.props;
    updateCompanyPosition(id, left, top);
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const propTypes = {
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

class DraggableCompanyIcon extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {
    this.setStyle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStyle(nextProps);
  }

  setStyle(nextProps) {
    const { positionX, positionY, target } = nextProps;
    if((positionX > 0.00 || positionY > 0.00) && target !== undefined) {
      var leftAbsolute = (positionX * target.width) + target.left;
      var topAbsolute = (positionY * target.height) + target.top;
      var style = {
        width: 32,
        position: 'absolute',
        left: leftAbsolute,
        top: topAbsolute
      }
      this.setState({
        style: style,
      });
    } else {
      this.resetState();
    }
  }

  resetState() {
    this.setState({ style: styles.logo })
  }

  render() {
    const { isDragging, connectDragSource, index, id } = this.props;
    const { style } = this.state;
    return connectDragSource(
        <img
          key={index}
          style={style}
          src={`${config.API_ROOT}/public/company${id}.png`}
        />
    );
  }
}

DraggableCompanyIcon.propTypes = propTypes;

// Export the wrapped component:
export default DragSource('companyIcon', spec, collect)(DraggableCompanyIcon);
