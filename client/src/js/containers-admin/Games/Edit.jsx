import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = { successAlert: false, dangerAlert: '' };
  }

  handleSuccessMessage = () => {
    this.setState({ successAlert: true });
  }

  handleDangerMessage = (message) => {
    this.setState({ dangerAlert: message });
  }

  render() {
    const { params, router } = this.props;

    const successAlert = (
      <Alert bsStyle="success" onDismiss={() => this.setState({ successAlert: false })}>
        <p>Game information successfully updated. {this.state.successAlert}</p>
      </Alert>
    );

    const dangerAlert = (
      <Alert bsStyle="danger" onDismiss={() => this.setState({ dangerAlert: '' })}>
        <p>Error: {this.state.dangerAlert}</p>
      </Alert>
    );

    return (
      <div>
        {this.state.successAlert && successAlert}
        {this.state.dangerAlert && dangerAlert}

        <Form
          id={params.id}
          handleSuccessMessage={this.handleSuccessMessage}
          handleDangerMessage={this.handleDangerMessage}
        />

        <button type="button" className="btn btn-default" onClick={() => router.goBack()} >
          <span aria-hidden="true">&larr;</span> Back
        </button>
      </div>
    );
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { _id: '', prefix: '', title: '', year: '', file: {} };
  }

  componentWillMount() {
    fetch(`/api/admin/games/edit/${this.props.id}`)
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(Error(`${response.status}: ${response.statusText}`));
        }
        return response.json();
      })
      .then((game) => {
        this.setState(game);
      })
      .catch((err) => {
        this.props.handleDangerMessage(err.message);
      });
  }

  handlePrefixChange = (e) => {
    this.setState({ prefix: e.target.value });
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  handleYearChange = (e) => {
    this.setState({ year: e.target.value });
  }

  handleFileChange = (e) => {
    this.setState({ year: e.target.files[0] });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/admin/games/edit/${this.props.id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(Error(`${response.status}: ${response.statusText}`));
        }
        return response.json();
      })
      .then((res) => {
        this.props.handleSuccessMessage();
      })
      .catch((err) => {
        this.props.handleDangerMessage(err.message);
      });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="id" className="col-sm-2 control-label">id</label>
            <div className="col-sm-10">
              <input
                name="id"
                value={this.state._id}
                type="text"
                className="form-control"
                readOnly
              />
            </div>
          </div>
        </form>

        <form className="form-horizontal" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="prefix" className="col-sm-2 control-label">Prefix</label>
            <div className="col-sm-10">
              <input
                name="prefix"
                value={this.state.prefix}
                type="text"
                className="form-control"
                onChange={this.handlePrefixChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="title" className="col-sm-2 control-label">Title</label>
            <div className="col-sm-10">
              <input
                name="title"
                value={this.state.title}
                type="text"
                className="form-control"
                onChange={this.handleTitleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="year" className="col-sm-2 control-label">Year</label>
            <div className="col-sm-10">
              <input
                name="year"
                value={this.state.year}
                type="text"
                className="form-control"
                onChange={this.handleYearChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="file" className="col-sm-2 control-label">Cover</label>
            <div className="col-sm-10">
              <input
                name="cover"
                type="file"
                className="file"
                onChange={this.handleFileChange}
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
