import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchOneGame } from '../../../actions/adminActions';
import GameEditForm from './form';

class GameEdit extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  showResults = values =>
    new Promise((resolve) => {
      setTimeout(() => {  // simulate server latency
        console.log(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
        resolve();
      }, 1500);
    })

  render() {
    const { ready, initialValues, router } = this.props;

    if (!ready) return null;

    return (
      <div>
        <GameEditForm initialValues={initialValues} onSubmit={this.showResults} />

        <button type="button" className="btn btn-default" onClick={router.goBack} >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
}

GameEdit.defaultProps = {
  initialValues: undefined,
};

GameEdit.propTypes = {
  ready: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    title: PropTypes.string.isRequired,
    year: PropTypes.number,
    cover: PropTypes.string,
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,

  actions: PropTypes.shape({
    didMount: PropTypes.func.isRequired,
    willUnmount: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ domain: { gameEdit }, entities }) {
  if (!gameEdit || gameEdit.pending) return { ready: false };

  const initialValues = entities.games[gameEdit.visible];
  return { ready: true, initialValues };
}

function mapDispatchToProps(dispatch) {
  const component = 'GameEdit';
  return {
    actions: {
      didMount: () => {
        dispatch({
          type: 'CONTAINER_MOUNT',
          component,
        });
      },
      willUnmount: () => {
        dispatch({
          type: 'CONTAINER_DESTROY',
          component,
        });
      },
      getData: (gameId) => {
        dispatch(fetchOneGame(gameId, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameEdit);
