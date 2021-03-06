import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Form, Field, reduxForm, propTypes } from 'redux-form';
import * as validationFields from '../../_sharedComponents/validationFields';
import { SelectFieldFilter, TextFieldFilter, TextField } from '../../_sharedComponents/fields';
import * as style from './FilterPanel.style';

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onFieldChange = handleSubmit => (e) => {
    const { removeFilter } = this.props.qs;
    if (e.target.value === '') {
      this.props.setFilter(removeFilter(e.target.name));
    }
    setTimeout(handleSubmit);
  }

  submit = (values) => {
    this.props.setFilter(values);
  }

  filterButtonHandler = filter => () => {
    this.props.setFilter(this.props.qs.removeFilter(filter));
  }

  openCloseButtonHandler = () => {
    this.setState({ open: !this.state.open });
  }

  checkboxTrigger = fieldName => (e) => {
    const { addFilter, removeFilter } = this.props.qs;

    if (e.target.checked) {
      this.props.setFilter(addFilter(fieldName));
    } else {
      this.props.setFilter(removeFilter(fieldName));
    }
  }

  render() {
    const { handleSubmit, filter, qs, filterFields } = this.props;

    const flattenFilters = qs.flatten(filter);

    const omitFilterButtons = Object.keys(flattenFilters).map((filterKey) => {
      let label = filterKey;
      let value = flattenFilters[filterKey];
      const filterParams = filterFields[filterKey];

      if (filterParams) {
        label = filterParams.label;
      }

      if (filterParams && filterParams.select) {
        const source = filterParams.select.source[value];
        if (source) {
          value = source[filterParams.select.text];
        }
      }

      return (
        <Button key={filterKey} className={style.filterBtn} onClick={this.filterButtonHandler(filterKey)}>
          {label}{' '}<b>is</b>{' '}{value}
          <span className={style.closeSign}>✕</span>
        </Button>
      );
    });

    const Fields = Object.keys(filterFields).map((name) => {
      const obj = filterFields[name];

      const validations = [];
      if (obj.validation) {
        obj.validation.forEach((val) => {
          if (validationFields[val]) {
            validations.push(validationFields[val]);
          }
        });
      }

      switch (obj.type) {
        case 'select': {
          const { source, value, text } = obj.select;
          const options = Object.values(source).map(item => (
            <option key={item[text]} value={item[value]}>{item[text]}</option>
          ));
          return (
            <Field
              key={name}
              name={name}
              component={SelectFieldFilter}
              label={obj.label}
              validate={validations}
              optionsSelect={options}
              onChange={this.onFieldChange(handleSubmit)}
              disabled={flattenFilters[name] === ''}
              checkboxTrigger={this.checkboxTrigger}
            />
          );
        }
        case 'text':
        default: {
          return (
            <Field
              key={name}
              name={name}
              type="text"
              component={obj.canBeBlank ? TextFieldFilter : TextField}
              label={obj.label}
              placeholder={false}
              validate={validations}
              onChange={this.onFieldChange(handleSubmit)}
              disabled={flattenFilters[name] === ''}
              checkboxTrigger={this.checkboxTrigger}
            />
          );
        }
      }
    });

    return (
      <div>
        <button title="Filters" type="button" className="btn btn-primary" onClick={this.openCloseButtonHandler}>
          <i className="fa fa-filter" aria-hidden="true" />
          {' '}Filters{' '}
          {this.state.open
            ? <i className="fa fa-angle-double-up" aria-hidden="true" />
            : <i className="fa fa-angle-double-down" aria-hidden="true" />
          }
        </button>

        {omitFilterButtons}

        {this.state.open &&
          <div className={style.filterContainer}>
            <Form className="form-horizontal" onSubmit={handleSubmit(this.submit)}>
              {Fields}
            </Form>
          </div>
        }
      </div>
    );
  }
}

FilterPanel.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  qs: PropTypes.shape({
    flatten: PropTypes.func.isRequired,
    unflatten: PropTypes.func.isRequired,
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
  }).isRequired,
  filterFields: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    validation: PropTypes.arrayOf(PropTypes.string),
    canBeBlank: PropTypes.bool,
    select: PropTypes.shape({
      source: PropTypes.objectOf(PropTypes.object).isRequired,
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  })).isRequired,
  ...propTypes,
};

export default reduxForm({ form: 'FilterPanel', enableReinitialize: true })(FilterPanel);
