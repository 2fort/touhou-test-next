import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class LoadingLine extends Component {
  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      setTimeout(() => this.show(), 1500);
    }

    if (this.props.active && !nextProps.active) {
      this.hide();
    }
  }

  show() {
    this.setState({ hidden: false });
  }

  hide() {
    this.setState({ hidden: true });
  }

  render() {
    if (this.props.active && !this.state.hidden) {
      return (
        <div className="load-bar">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      );
    }
    return (
      <div className="load-bar-inactive">
        {' '}
      </div>
    );
  }
}

LoadingLine.propTypes = {
  active: PropTypes.bool.isRequired,
};

function mapStateToProps({ domain }) {
  const active = Object.values(domain).some(dom => (dom && dom.activeRequests > 0));

  return { active };
}

export default connect(mapStateToProps)(LoadingLine);
