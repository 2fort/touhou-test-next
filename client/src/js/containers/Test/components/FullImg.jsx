import React, { PropTypes, Component } from 'react';
import Modal from 'react-modal';
import * as style from './FullImg.style';

class FullImg extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  trigger = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { image } = this.props;
    const { expanded } = this.state;

    const imgProps = { onClick: this.trigger };

    return (
      <div>
        <button type="button" onClick={this.trigger} className={style.btnExpand}>
          <i className="fa fa-expand" aria-hidden="true" />
        </button>
        <Modal isOpen={expanded} className="fullimgmodal" onRequestClose={this.trigger} contentLabel="FullImg">
          <img alt="full" src={process.env.IMG_COMPRESSED + image} className={style.fullimg} {...imgProps} />
        </Modal>
      </div>
    );
  }
}

FullImg.propTypes = {
  image: PropTypes.string.isRequired,
};

export default FullImg;
