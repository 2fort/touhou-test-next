import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import timestamp from 'time-stamp';
import { del } from '../../../ducks/flashMessage';

class FlashMsg extends Component {
  componentWillUnmount() {
    if (this.props.msg.text) {
      this.props.dispatch(del());
    }
  }

  closeBtnHandler = () => {
    this.props.dispatch(del());
  }

  render() {
    const { msg } = this.props;

    if (!msg.text) return null;

    return (
      <div className={`alert alert-${msg.type} alert-dismissible sticky`} role="alert">
        <button type="button" className="close" id="flashMessageBtn" aria-label="Close" onClick={this.closeBtnHandler}>
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="pull-left">
          {msg.status && <strong>{msg.status}: </strong>}
          {msg.text}
        </div>
        <div className="pull-right">
          {timestamp('HH:mm:ss', msg.date)}
        </div>
        &nbsp;
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
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps({ flashMessage }) {
  return { msg: flashMessage };
}

export default connect(mapStateToProps)(withRouter(FlashMsg));
