import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import timestamp from 'time-stamp';
import { flushMsg } from '../../../actions/adminActions';

class FlashMsg extends Component {
  componentWillReceiveProps(nextProps) {
    const { msg, location } = this.props;

    if (msg.text && location.pathname !== nextProps.location.pathname) {
      this.props.popMsg();
    }
  }

  componentWillUnmount() {
    if (this.props.msg.text) {
      this.props.popMsg();
    }
  }

  render() {
    const { msg, popMsg } = this.props;

    if (!msg.text) return null;

    return (
      <div className={`alert alert-${msg.type} alert-dismissible`} role="alert">
        <button type="button" className="close" aria-label="Close" onClick={popMsg}>
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>{timestamp('HH:mm:ss', msg.date)}: </strong>{msg.text}
      </div>
    );
  }
}

FlashMsg.propTypes = {
  msg: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.date,
  }).isRequired,
  popMsg: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps({ msg }) {
  return { msg };
}

function mapDispatchToProps(dispatch) {
  return {
    popMsg: () => {
      dispatch(flushMsg());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FlashMsg));
