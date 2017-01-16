import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CharacterEditForm from './form';
import { fetchOneCharacter } from '../../../actions/adminActions';

const CharacterEdit = class CharacterEdit extends Component {
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
    const { initialValues, router, ready, gamesData } = this.props;

    if (!ready) return null;

    return (
      <div>
        <CharacterEditForm initialValues={initialValues} onSubmit={this.showResults} gamesData={gamesData} />
        <button type="button" className="btn btn-default" onClick={router.goBack}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
};

CharacterEdit.defaultProps = {
  initialValues: undefined,
  gamesData: undefined,
};

CharacterEdit.propTypes = {
  ready: PropTypes.bool.isRequired,

  gamesData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    wiki: PropTypes.string,
    art: PropTypes.shape({
      author: PropTypes.string,
      url: PropTypes.string,
    }),
    image: PropTypes.string,
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

function mapStateToProps({ domain: { characterEdit }, entities }) {
  if (!characterEdit || characterEdit.pending) return { ready: false };

  const initialValues = entities.characters[characterEdit.visible];
  const gamesData = Object.values(entities.games).map(game => ({ id: game.id, title: game.title }));

  return { ready: true, initialValues, gamesData };
}

function mapDispatchToProps(dispatch) {
  const component = 'CharacterEdit';
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
        dispatch(fetchOneCharacter(gameId, component));
      },
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterEdit);
