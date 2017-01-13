import React, { Component, PropTypes } from 'react';
import update from 'immutability-helper';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = { games: [] };
  }
  componentWillMount() {
    fetch('/api/admin/games')
      .then(response => response.json())
      .then((games) => {
        this.setState({ games });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <Form games={this.state.games} id={this.props.params.id} />
        <button type="button" className="btn btn-default" onClick={() => this.props.router.goBack()}>
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      image: '',
      art: {
        author: '',
        url: '',
      },
      _game: {
        id: '',
        title: '',
      },
      wiki: '',
    };
  }

  componentWillMount() {
    fetch(`/api/admin/characters/edit/${this.props.id}`)
      .then((response) => {
        return response.json();
      })
      .then((character) => {
        this.setState(character);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  nameChangeHandler = (e) => {
    this.setState({ name: e.target.value });
  }

  gameChangeHandler = (e) => {
    const newState = update(this.state, {
      _game: { title: { $set: e.target.value } },
    });
    this.setState(newState);
  }

  artAuthorChangeHandler = (e) => {
    const newState = update(this.state, {
      art: { author: { $set: e.target.value } },
    });
    this.setState(newState);
  }

  artUrlChangeHandler = (e) => {
    const newState = update(this.state, {
      art: { url: { $set: e.target.value } },
    });
    this.setState(newState);
  }

  wikiChangeHandler = (e) => {
    this.setState({ wiki: e.target.value });
  }

  render() {
    console.log(this.state);
    const gamesList = this.props.games.map((game, i) => (
      <option key={i} value={game.title}>{game.title}</option>
    ));
    console.log(this.state._game.title);

    return (
      <div>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="id" className="col-sm-2 control-label">id</label>
            <div className="col-sm-10">
              <input name="id" value={this.state.id} type="text" className="form-control" readOnly />
            </div>
          </div>
        </form>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input
                name="name"
                value={this.state.name}
                type="text"
                className="form-control"
                onChange={this.nameChangeHandler}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="game" className="col-sm-2 control-label">Game</label>
            <div className="col-sm-10">
              <select
                name="game"
                value={this.state._game.title}
                className="form-control"
                onChange={this.gameChangeHandler}
              >
                {gamesList}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="artAuthor" className="col-sm-2 control-label">Art author</label>
            <div className="col-sm-10">
              <input
                name="artAuthor"
                value={this.state.art.author}
                type="text"
                className="form-control"
                onChange={this.artAuthorChangeHandler}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="artUrl" className="col-sm-2 control-label">Art url</label>
            <div className="col-sm-10">
              <input
                name="artUrl"
                value={this.state.art.url}
                type="text"
                className="form-control"
                onChange={this.artUrlChangeHandler}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="wiki" className="col-sm-2 control-label">Wiki</label>
            <div className="col-sm-10">
              <input
                name="wiki"
                value={this.state.wiki}
                type="text"
                className="form-control"
                onChange={this.wikiChangeHandler}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Edit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Edit;
