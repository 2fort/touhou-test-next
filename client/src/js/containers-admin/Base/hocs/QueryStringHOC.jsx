import React, { PropTypes, Component } from 'react';
import { stringify } from 'qs';
import flatten from 'flat';

const unflatten = flatten.unflatten;

function parseQuery({ sort, filter, page, limit }) {
  return Object.assign(
    {}, sort && { sort }, filter && { filter }, page && { page: Number(page) }, limit && { limit: Number(limit) },
  );
}

export default (ComposedComponent) => {
  class QueryStringHOC extends Component {
    componentWillMount() {
      const { location, component } = this.props;

      const query = parseQuery(location.query);

      if (Object.keys(query).length > 0) {
        component.setQuery(query);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.router.location.search === '') {
        this.setQueryString();
      }
    }

    setQueryString = () => {
      const { location, router, component } = this.props;
      const { query } = component.getState();
      router.replace(`${location.pathname}?${stringify(query, { encode: false })}`);
    }

    flatten = filters => flatten(filters);

    unflatten = filters => unflatten(filters);

    addFilter = (fieldName) => {
      const { query: { filter } } = this.props;

      const newFilter = this.unflatten({ [fieldName]: '' });
      return Object.assign({}, filter, newFilter);
    }

    removeFilter = (fieldName) => {
      const { query: { filter } } = this.props;

      const flattenFilters = this.flatten(filter);
      delete flattenFilters[fieldName];
      return this.unflatten(flattenFilters);
    }

    render() {
      return (
        <ComposedComponent
          qs={{
            setQueryString: this.setQueryString,
            flatten: this.flatten,
            unflatten: this.unflatten,
            addFilter: this.addFilter,
            removeFilter: this.removeFilter,
          }}
          {...this.props}
        />
      );
    }
  }

  QueryStringHOC.propTypes = {
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        page: PropTypes.string,
        limit: PropTypes.string,
        sort: PropTypes.string,
        filter: PropTypes.objectOf(PropTypes.any),
      }),
    }).isRequired,
    component: PropTypes.shape({
      setQuery: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
    }).isRequired,
    query: PropTypes.shape({
      page: PropTypes.number.isRequired,
      limit: PropTypes.number.isRequired,
      sort: PropTypes.string.isRequired,
      filter: PropTypes.objectOf(PropTypes.any).isRequired,
    }).isRequired,
  };

  return QueryStringHOC;
};

