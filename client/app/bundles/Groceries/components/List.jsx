import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { formatDate } from '../utils/format';
import listIconClass from '../utils/list_icon';

export default class List extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      users_list_id: PropTypes.number,
      owner_id: PropTypes.number,
    }).isRequired,
    accepted: PropTypes.bool,
    onListDeletion: PropTypes.func,
    onListCompletion: PropTypes.func,
    onListRefresh: PropTypes.func,
    onListAcceptance: PropTypes.func,
    onListRejection: PropTypes.func,
  }

  static defaultProps = {
    onListDeletion: null,
    onListCompletion: null,
    onListRefresh: null,
    accepted: false,
    onListAcceptance: null,
    onListRejection: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUserPermissions: 'read',
    };
  }

  componentWillMount() {
    $.ajax({
      type: 'GET',
      url: `/lists/${this.props.list.id}/users_lists/${this.props.list.users_list_id}`,
      dataType: 'JSON',
    }).done((data) => {
      this.setState({
        currentUserPermissions: data.permissions,
      });
    });
  }

  handleDelete = () => this.props.onListDeletion(this.props.list.id);

  handleComplete = () => this.props.onListCompletion(this.props.list);

  handleRefresh = () => this.props.onListRefresh(this.props.list);

  handleAccept = () => this.props.onListAcceptance(this.props.list);

  handleReject = () => this.props.onListRejection(this.props.list);

  notCompletedListButtons = () => {
    if (this.props.userId !== this.props.list.owner_id) {
      if (this.state.currentUserPermissions === 'write') {
        return (
          <div className="btn-group float-right" role="group">
            <Link to={`lists/${this.props.list.id}/users_lists`} className="btn btn-link p-0 mr-3">
              <i className="fa fa-users fa-2x text-primary" />
            </Link>
          </div>
        );
      }
      return '';
    }
    return (
      <div className="btn-group float-right" role="group">
        <button onClick={this.handleComplete} className="btn btn-link p-0 mr-3">
          <i className="fa fa-check-square-o fa-2x text-success" />
        </button>
        <Link to={`lists/${this.props.list.id}/users_lists`} className="btn btn-link p-0 mr-3">
          <i className="fa fa-users fa-2x text-primary" />
        </Link>
        <Link to={`/lists/${this.props.list.id}/edit`} className="btn btn-link p-0 mr-3">
          <i className="fa fa-pencil-square-o fa-2x text-warning" />
        </Link>
        <button onClick={this.handleDelete} className="btn btn-link p-0">
          <i className="fa fa-trash fa-2x text-danger" />
        </button>
      </div>
    );
  }

  completedListButtons = () => {
    if (this.props.userId !== this.props.list.owner_id) return '';
    return (
      <div className="btn-group float-right" role="group">
        <button onClick={this.handleRefresh} className="btn btn-link p-0 mr-3">
          <i className="fa fa-refresh fa-2x text-primary" />
        </button>
        <button onClick={this.handleDelete} className="btn btn-link p-0">
          <i className="fa fa-trash fa-2x text-danger" />
        </button>
      </div>
    );
  }

  unacceptedListButtons = () => (
    <div className="btn-group float-right" role="group">
      <button onClick={this.handleAccept} className="btn btn-link p-0 mr-3">
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <button onClick={this.handleReject} className="btn btn-link p-0 mr-3">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  acceptedListButtons = () => {
    if (this.props.list.completed) return this.completedListButtons();
    return this.notCompletedListButtons();
  };

  testClass = () => (this.props.list.completed ? 'completed-list' : 'non-completed-list');

  acceptedListClass = () => (this.props.accepted ? 'accepted-list' : '');

  conditionalButtons = () => {
    if (this.props.accepted) return this.acceptedListButtons();
    return this.unacceptedListButtons();
  }

  render() {
    return (
      <div
        className={`list-group-item ${this.acceptedListClass()}`}
        style={{ display: 'block' }}
        data-test-class={this.testClass()}
      >
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
            { this.conditionalButtons() }
          </div>
        </div>
      </div>
    );
  }
}
