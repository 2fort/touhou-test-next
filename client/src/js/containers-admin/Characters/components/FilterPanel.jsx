import React, { Component, PropTypes } from 'react';
import { Form, Field, reduxForm, propTypes } from 'redux-form';
import flatten from 'flat';
import { SelectFieldFilter, TextFieldFilter } from '../../_sharedComponents/fields';
import { minLength } from '../../_sharedComponents/validationFields';

const unflatten = require('flat').unflatten;

class FilterPanel extends Component {
  submit = (values) => {
    this.props.setFilter(values);
  }

  checkboxTrigger = (fieldName) => {
    const flattenFilters = flatten(this.props.initialValues);

    if (Object.keys(flattenFilters).includes(fieldName)) {
      delete flattenFilters[fieldName];
      const newFilters = unflatten(flattenFilters);
      this.props.setFilter(newFilters);
    } else {
      const newFilter = unflatten({ [fieldName]: '' });
      this.props.setFilter(Object.assign({}, this.props.initialValues, newFilter));
    }
  }

  render() {
    const { filterPanelOpen, openTrigger, handleSubmit, initialValues, allGames } = this.props;

    const fieldNames = {
      name: 'Name',
      'art.author': 'Art Author',
      _game: 'Game',
    };

    const gameOptions = Object.values(allGames).map(game => (
      <option key={game.title} value={game.id}>{game.title}</option>
    ));

    const flattenFilters = flatten(initialValues);

    const omitFilterButtons = Object.keys(flattenFilters).map((filter) => {
      if (Object.keys(fieldNames).includes(filter)) {
        const gameName = (filter === '_game' && allGames[flattenFilters[filter]])
          ? allGames[flattenFilters[filter]].title
          : undefined;

        return (
          <button
            key={filter}
            onClick={() => { this.checkboxTrigger(filter); }}
            type="button"
            className="btn btn-default"
            style={{ marginLeft: '7px' }}
          >
            {fieldNames[filter]}
            {' '}<b>is</b>{' '}
            {gameName || flattenFilters[filter]}
            <span className="close-sign">✕</span>
          </button>
        );
      }
      return undefined;
    });

    return (
      <div>
        <button title="Filters" type="button" className="btn btn-primary" onClick={openTrigger}>
          <i className="fa fa-filter" aria-hidden="true" />
          {' '}Filters{' '}
          {filterPanelOpen
            ? <i className="fa fa-angle-double-up" aria-hidden="true" />
            : <i className="fa fa-angle-double-down" aria-hidden="true" />
          }
        </button>

        {omitFilterButtons}

        {filterPanelOpen &&
          <div style={{ margin: '5px 0', padding: '10px 0', backgroundColor: '#f9f9f9' }}>
            <Form className="form-horizontal" onSubmit={handleSubmit(this.submit)}>
              <Field
                name="name"
                type="text"
                component={TextFieldFilter}
                label="Name"
                validate={[minLength(2)]}
                onChange={() => { setTimeout(handleSubmit); }}
                disabled={!Object.keys(flattenFilters).includes('name')}
                checkboxTrigger={this.checkboxTrigger}
              />
              <Field
                name="art.author"
                type="text"
                component={TextFieldFilter}
                label="Art Author"
                onChange={() => { setTimeout(handleSubmit); }}
                disabled={!Object.keys(flattenFilters).includes('art.author')}
                checkboxTrigger={this.checkboxTrigger}
              />
              <Field
                name="_game"
                type="text"
                component={SelectFieldFilter}
                label="Game"
                optionsSelect={gameOptions}
                onChange={() => { setTimeout(handleSubmit); }}
                disabled={!Object.keys(flattenFilters).includes('_game')}
                checkboxTrigger={this.checkboxTrigger}
              />
            </Form>
          </div>
        }
      </div>
    );
  }
}

FilterPanel.defaultProps = {
  initialValues: {},
  allGames: {},
};

FilterPanel.propTypes = {
  filterPanelOpen: PropTypes.bool.isRequired,
  openTrigger: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    _game: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  allGames: PropTypes.objectOf(PropTypes.object),
  ...propTypes,
};

export default reduxForm({ form: 'FilterPanel', enableReinitialize: true })(FilterPanel);
