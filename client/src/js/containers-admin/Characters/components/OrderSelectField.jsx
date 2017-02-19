import React, { Component, PropTypes } from 'react';
import { IMG_THUMBNAIL } from '../../../config';

class OrderSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = { charList: [] };
  }

  componentWillMount() {
    if (this.props.reduxValues._game) {
      this.reloadCharList(this.props.reduxValues._game);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reduxValues._game && nextProps.reduxValues._game !== this.props.reduxValues._game) {
      // make previous charList empty or it will cause errors
      this.setState({ charList: [] });
      // refill charList with characters from selected game
      this.reloadCharList(nextProps.reduxValues._game);
    }
  }

  getImgSrc = () => {
    const { initialValues, reduxValues, fileImageField } = this.props;

    // return one of values based on it's priority

    // if file selected, take preview from fileImageField's state
    if (reduxValues.fileImage && reduxValues.fileImage[0]) {
      return fileImageField.getRenderedComponent().getImgPreview();
    }

    // if file was selected, but canceled or just marked for deletion
    if (reduxValues.fileImage) {
      return '';
    }

    // fallback to image from initialValues
    if (initialValues.image) {
      return IMG_THUMBNAIL + initialValues.image;
    }

    return '';
  }

  reloadCharList = (gameId) => {
    // this action is from base component's duck
    this.props.getCharsFromGame(gameId)
      .then((charList) => {
        // change Field's value first, because setState will cause immidiately re-render
        if (!this.props.initial || this.props.mode === 'new') {
          this.props.input.onChange(charList.length + 1);
        }
        // set charList
        this.setState({ charList });
      });
  }

  // up & down buttons onClick handler
  changeValue = number => () => {
    this.props.input.onChange(this.props.input.value + number);
  }

  makeCharTable = (charList) => {
    const { mode, initialValues, reduxValues, input, initial } = this.props;
    // array to be returned to render()
    const returnArray = [];
    // loop limit restriction
    // if initial === false, we need to add +1, because this character will be new and last in selected _game
    const limit = (!initial || mode === 'new') ? charList.length + 1 : charList.length;
    // this only affects charList in Edit mode (we need charList without current character), in New mode it do nothing
    const cleanList = charList.filter(char => initialValues.id !== char.id);
    // pointer to next character in cleanList
    let nextChar = 0;

    for (let i = 0; i < limit; i++) {
      // add current character
      if (input.value === i + 1) {
        const currentImgSrc = this.getImgSrc();
        returnArray.push(
          <tr className="info" key={reduxValues.name ? reduxValues.name : i + 1}>
            <td>{i + 1}</td>
            <td>
              {currentImgSrc &&
                <img height={50} alt="char preview" src={currentImgSrc} />
              }
            </td>
            <td>
              {reduxValues.name}
            </td>
          </tr>,
        );
      } else {
        // add character from charList
        returnArray.push(
          <tr key={cleanList[nextChar].name}>
            <td>{i + 1}</td>
            <td>
              {cleanList[nextChar].image &&
                <img height={50} alt={cleanList[nextChar].name} src={IMG_THUMBNAIL + cleanList[nextChar].image} />
              }
            </td>
            <td>
              {cleanList[nextChar].name}
            </td>
          </tr>,
        );
        // change pointer to next
        nextChar += 1;
      }
    }

    return returnArray;
  }

  render() {
    const { mode, initial, input } = this.props;
    const { charList } = this.state;

    return (
      <div className="form-group" style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
        <label htmlFor="_order" className="col-sm-2 control-label" style={{ alignSelf: 'flex-start' }}>Order</label>
        <div className="col-sm-9">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>image</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              {charList[0] && this.makeCharTable(charList)}
            </tbody>
          </table>
        </div>
        <div className="col-sm-1">
          <button
            type="button"
            className="btn btn-default"
            onClick={this.changeValue(-1)}
            disabled={input.value === 1}
          >
            <i className="fa fa-chevron-up" aria-hidden="true" />
          </button>
          <br /> <br />
          <button
            type="button"
            className="btn btn-default"
            onClick={this.changeValue(1)}
            disabled={!initial || mode === 'new' ? input.value === charList.length + 1 : input.value === charList.length}
          >
            <i className="fa fa-chevron-down" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }
}

OrderSelectField.defaultProps = {
  fileImageField: {},
};

OrderSelectField.propTypes = {
  initial: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    _game: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.string,
  }).isRequired,
  reduxValues: PropTypes.shape({
    name: PropTypes.string,
    _game: PropTypes.string,
    fileImageField: PropTypes.object,
  }).isRequired,
  getCharsFromGame: PropTypes.func.isRequired,
  fileImageField: PropTypes.shape({
    getRenderedComponent: PropTypes.func.isRequired,
  }),
};

export default OrderSelectField;
