import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class UnacceptedList extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    }).isRequired,
    onListAcceptance: PropTypes.func.isRequired,
    onListRejection: PropTypes.func.isRequired,
  }

  handleAccept = () => this.props.onListAcceptance(this.props.list);

  handleReject = () => this.props.onListRejection(this.props.list.id);

  render() {
    return (
      <div className="list-group">
        <div className="list-group-item" style={{ display: 'block' }}>
          <div className="row">
            <div className="col-md-10 pt-1">
              <h5 className="mb-1">
                {this.props.list.name}
              </h5>
            </div>
            <div className="col-md-2">
              <div className="btn-group float-right" role="group">
                <button onClick={this.handleAccept} className="btn btn-link p-0 mr-3">
                  <i className="fa fa-check-square-o fa-2x text-success" />
                </button>
                <button onClick={this.handleReject} className="btn btn-link p-0 mr-3">
                  <i className="fa fa-trash fa-2x text-danger" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
