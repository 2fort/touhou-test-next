import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector, getFormInitialValues, propTypes } from 'redux-form';

import { IMG_THUMBNAIL } from '../../../config';
import { TextField, ImageField, OrderSelectField } from '../../_sharedComponents/fields';
import { required } from '../../_sharedComponents/validationFields';
import FilePreviewHoc from '../../_sharedComponents/FilePreviewHoc';

class CharFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = { charList: [] };
  }

  componentDidMount() {
    const { initialValues } = this.props;
    const initialRel = initialValues.link ? initialValues.link.rel : undefined;

    if (initialRel) {
      this.reloadCharList(initialRel)
        .then((length) => {
          this.props.change('link.order', this.chageOrder(initialValues, length));
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentValues } = this.props;
    const currentRel = currentValues.link ? currentValues.link.rel : undefined;
    const nextRel = nextProps.currentValues.link ? nextProps.currentValues.link.rel : undefined;

    if (currentRel !== nextRel) {
      this.setState({ charList: [] });

      if (!nextRel) {
        this.props.change('link.order', null);
        return;
      }

      this.reloadCharList(nextRel)
        .then((length) => {
          this.props.change('link.order', this.chageOrder(nextProps.currentValues, length));
        });
    }

    if (!this.props.pristine && nextProps.pristine) {
      this.props.filePreview.revoke();
    }
  }

  chageOrder = (currentValues, length) => {
    const { mode, initialValues } = this.props;
    const initialRel = initialValues.link ? initialValues.link.rel : undefined;
    const currentRel = currentValues.link ? currentValues.link.rel : undefined;

    if (mode === 'new') {
      return length + 1;
    }
    if (mode === 'edit' && currentRel !== initialRel) {
      return length + 1;
    }
    if (mode === 'edit' && currentRel === initialRel) {
      return initialValues.link.order;
    }
    return null;
  }

  reloadCharList = id =>
    this.props.getCharsFromGame(id)
      .then((charList) => {
        this.setState({ charList });
        return (charList.length);
      });

  prepareGameOptionsForSelectField = () => {
    const options = Object.values(this.props.allGames).map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));
    return options;
  }

  prepareCharListForOrderField = () => {
    const { initialValues, currentValues, filePreview } = this.props;
    const { charList } = this.state;

    const cleanList = charList.filter(char => initialValues.id !== char.id);
    const defaultImage = currentValues.image && typeof currentValues.image === 'string'
      ? currentValues.image
      : null;

    const newObj = {
      id: initialValues.id,
      name: currentValues.name,
      image: filePreview.blob || defaultImage || '',
    };

    const newList = [...cleanList];

    newList.splice(currentValues.link.order - 1, 0, newObj);

    const tableBody = newList.map((char, i) => (
      <tr className={char.id === initialValues.id ? 'info' : ''} key={char.name}>
        <td>{i + 1}</td>
        <td>
          {char.image &&
            <img
              height={50}
              alt="char preview"
              src={filePreview.blobTest(char.image) ? char.image : IMG_THUMBNAIL + char.image}
            />
          }
        </td>
        <td>
          {char.name}
        </td>
      </tr>
    ));

    return (
      <table className="table table-striped table-order-field">
        <thead>
          <tr>
            <th>Position</th>
            <th>Image</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    );
  }

  gameSelectHandler = (e) => {
    if (e.target.value === '') {
      e.preventDefault();
      this.props.change('link.rel', null);
    }
  }

  render() {
    const { mode, title, buttonName, currentValues, hide, handleSubmit, submitting, error, reset, filePreview } = this.props;

    const gameOptions = this.prepareGameOptionsForSelectField();
    const charList = this.prepareCharListForOrderField();
    const currentRel = currentValues.link ? currentValues.link.rel : undefined;

    return (
      <div className="static-modal">
        <Modal show onHide={hide} bsSize="large">
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <form encType="multipart/form-data" className="form-horizontal" onSubmit={handleSubmit}>
            <Modal.Body>
              <Field name="id" type="hidden" component="input" />
              <Field name="name" type="text" component={TextField} label="Name" validate={[required]} />
              <Field
                name="image"
                type="file"
                component={ImageField}
                label="Image"
                filePreview={filePreview}
              />

              <div className="form-group">
                <label htmlFor="link.rel" className="col-sm-2 control-label">Game</label>
                <div className="col-sm-10">
                  <Field name="link.rel" component="select" className="form-control" onChange={this.gameSelectHandler}>
                    <option />
                    {gameOptions}
                  </Field>
                </div>
              </div>

              {currentRel &&
                <Field
                  name="link.order"
                  component={OrderSelectField}
                  list={charList}
                />
              }

              <Field name="art.author" type="text" component={TextField} label="Art author" />
              <Field name="art.url" type="text" component={TextField} label="Art url" />
              <Field name="wiki" type="text" component={TextField} label="Wiki" />

              {error &&
                <Alert bsStyle="danger"><strong>Error: </strong>{error}</Alert>
              }
            </Modal.Body>

            <Modal.Footer>
              <Button type="submit" disabled={submitting} bsStyle="primary">
                {submitting && <i className="fa fa-spinner fa-spin" />} {buttonName}
              </Button>
              {mode === 'edit' && <Button onClick={reset}>Reset</Button>}
              <Button onClick={hide}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

CharFormModal.defaultProps = {
  initialValues: {},
  error: '',
  allGames: {},
};

CharFormModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  allGames: PropTypes.objectOf(PropTypes.object),
  hide: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.shape({
      rel: PropTypes.string,
      order: PropTypes.number,
    }),
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    wiki: PropTypes.string,
  }),
  currentValues: PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.shape({
      rel: PropTypes.string,
      order: PropTypes.number,
    }),
    image: PropTypes.any,
  }).isRequired,
  filePreview: PropTypes.shape({
    add: PropTypes.func.isRequired,
    revoke: PropTypes.func.isRequired,
    blob: PropTypes.string.isRequired,
    blobTest: PropTypes.func.isRequired,
  }).isRequired,
  ...propTypes,
};

const selector = formValueSelector('CharFormModal');

function mapStateToProps(state) {
  return {
    currentValues: {
      name: selector(state, 'name'),
      link: {
        rel: selector(state, 'link.rel'),
        order: selector(state, 'link.order'),
      },
      image: selector(state, 'image'),
    },
    initialValues: getFormInitialValues('CharFormModal')(state),
  };
}

export default connect(mapStateToProps)(
  reduxForm({ form: 'CharFormModal', enableReinitialize: true })(
    FilePreviewHoc(CharFormModal)),
);
