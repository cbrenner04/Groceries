import React, { Component } from 'react';
import PropTypes from 'prop-types';

import formatDate from '../utils/format';

export default class List extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
    onListDeletion: PropTypes.func.isRequired,
  }

  handleDelete = () => {
    this.props.onListDeletion(this.props.list.id);
  }

  handleSelect = () => {
    // TODO: update to use react router
    window.location = `/lists/${this.props.list.id}`;
  }

  handleShare = () => {
    // TODO: update to use react router
    window.location = `/users_lists/new?list_id=${this.props.list.id}`;
  }

  handleEdit = () => {
    // TODO: update to use react router
    window.location = `/lists/${this.props.list.id}/edit`;
  }

  handleComplete = () => {
    $.ajax({
      url: `/lists/${this.props.list.id}`,
      type: 'PUT',
      data: 'list%5Bcompleted%5D=true',
      success: () => this.refreshPage(), // TODO: this is hacky as hell
    });
  }

  refreshPage = () => {
    window.location = '/';
  }

  listIsCompleted() {
    if (this.props.list.completed) {
      return (
        <small className="text-success">Completed</small>
      );
    }
    return '';
  }

  showCompleteButton() {
    if (!this.props.list.completed) {
      return (
        <div
          onClick={this.handleComplete}
          className="fa fa-check-square-o fa-2x text-success action-button"
          style={{ marginRight: '1rem' }}
          role="presentation"
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div className="list-group">
        <div
          className="list-group-item accepted-list"
          style={{ display: 'block' }}
        >
          <div className="row">
            <div className="col-md-6">
              <h5
                className="mb-1 action-button"
                onClick={this.handleSelect}
                role="presentation"
              >
                {this.props.list.name} {this.listIsCompleted()}
              </h5>
            </div>
            <div className="col-md-4">
              <small className="text-muted">
                {formatDate(this.props.list.created_at)}
              </small>
            </div>
            <div className="col-md-2">
              <div className="btn-group float-right" role="group">
                {this.showCompleteButton()}
                <div
                  onClick={this.handleShare}
                  className="fa fa-users fa-2x text-primary action-button"
                  style={{ marginRight: '1rem' }}
                  role="presentation"
                />
                <div
                  onClick={this.handleEdit}
                  className="fa fa-pencil-square-o fa-2x text-warning action-button"
                  style={{ marginRight: '1rem' }}
                  role="presentation"
                />
                <div
                  className="fa fa-trash fa-2x text-danger action-button"
                  onClick={this.handleDelete}
                  role="presentation"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
