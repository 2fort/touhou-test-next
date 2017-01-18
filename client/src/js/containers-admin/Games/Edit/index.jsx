import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchOneGame, editGame } from '../../../actions/adminActions';
import GameEditForm from './form';

class GameEdit extends Component {
  componentWillMount() {
    this.props.actions.didMount();
    this.props.actions.getData(this.props.params.id);
  }

  componentWillUnmount() {
    this.props.actions.willUnmount();
  }

  render() {
    const { ready, initialValues, timestamp, actions, router, params } = this.props;

    if (!ready) return null;

    return (
      <div>
        <GameEditForm initialValues={initialValues} onSubmit={actions.sendData(params.id)} timestamp={timestamp} />

        <button type="button" className="btn btn-default" onClick={router.goBack} >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
}

GameEdit.defaultProps = {
  initialValues: undefined,
  timestamp: undefined,
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
  timestamp: PropTypes.number,
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
    sendData: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ domain: { gameEdit }, entities }) {
  if (!gameEdit || gameEdit.pending) return { ready: false };

  const initialValues = entities.games[gameEdit.visible];
  return { ready: true, initialValues, timestamp: gameEdit.fetchedAt };
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
      sendData: gameId => values =>
        dispatch(editGame(gameId, values, component)),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameEdit);
