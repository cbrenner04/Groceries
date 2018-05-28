import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import formatDate from '../utils/format';
import listIconClass from '../utils/list_icon';

export default class List extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
    onListDeletion: PropTypes.func.isRequired,
    onListCompletion: PropTypes.func.isRequired,
  }

  handleDelete = () => this.props.onListDeletion(this.props.list.id);

  handleComplete = () => this.props.onListCompletion(this.props.list);

  render() {
    return (
      <div className="list-group-item accepted-list" style={{ display: 'block' }} data-test-class="non-completed-list">
        <div className="row">
          <div className="col-md-6 pt-1">
            <Link to={`/lists/${this.props.list.id}`} className="router-link">
              <h5 className="mb-1">
                <i className={`fa ${listIconClass(this.props.list.type)} text-info mr-3`} />
                {this.props.list.name}
              </h5>
            </Link>
          </div>
          <div className="col-md-4 pt-1">
            <small className="text-muted">
              {formatDate(this.props.list.created_at)}
            </small>
          </div>
          <div className="col-md-2">
            <div className="btn-group float-right" role="group">
              <button onClick={this.handleComplete} className="btn btn-link p-0 mr-3">
                <i className="fa fa-check-square-o fa-2x text-success" />
              </button>
              <Link to={`lists/${this.props.list.id}/users_lists/new`} className="btn btn-link p-0 mr-3">
                <i className="fa fa-users fa-2x text-primary" />
              </Link>
              <Link to={`/lists/${this.props.list.id}/edit`} className="btn btn-link p-0 mr-3">
                <i className="fa fa-pencil-square-o fa-2x text-warning" />
              </Link>
              <button onClick={this.handleDelete} className="btn btn-link p-0">
                <i className="fa fa-trash fa-2x text-danger" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
