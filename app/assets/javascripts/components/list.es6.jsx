class List extends React.Component {
  handleDelete() {
    this.props.onListDeletion(this.props.list.id);
  }

  handleSelect() {
    window.location = `/lists/${this.props.list.id}`;
  }

  handleShare() {
    window.location = `/users_lists/new?list_id=${this.props.list.id}`;
  }

  handleEdit() {
    window.location = `/lists/${this.props.list.id}/edit`;
  }

  render() {
    return (
      <div className="list-group">
        <div className="list-group-item" style={{ display: "block" }}>
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-1" onClick={ () => this.handleSelect() }>
                { this.props.list.name }
              </h5>
            </div>
            <div className="col-md-4">
              <small className="text-muted">
                { formatDate(this.props.list.created_at) }
              </small>
            </div>
            <div className="col-md-2">
              <div className="btn-group float-right" role="group">
                <div onClick={ () => this.handleShare() }
                     className="fa fa-users fa-2x text-primary"
                     style={{ marginRight: '1rem' }}></div>
                <div onClick={ () => this.handleEdit() }
                     className="fa fa-pencil-square-o fa-2x text-warning"
                     style={{ marginRight: '1rem' }}></div>
                <div className="fa fa-trash fa-2x text-danger"
                     onClick={ () => this.handleDelete() }></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
