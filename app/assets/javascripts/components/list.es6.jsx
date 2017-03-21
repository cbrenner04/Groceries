class List extends React.Component {
  handleDelete(listId) {
    this.props.onListDeletion(listId);
  }

  render() {
    return (
      <div className="list-group">
        <div className="list-group-item" style={{ display: "block" }}>
          <div className="row">
            <div className="col-md-6">
              <a href={ "/lists/" + this.props.list.id }>
                <h5 className="mb-1">{ this.props.list.name }</h5>
              </a>
            </div>
            <div className="col-md-4">
              <small className="text-muted">{ formatDate(this.props.list.created_at) }</small>
            </div>
            <div className="col-md-2">
              <div className="btn-group float-right" role="group">
                <a href={ '/lists/' + this.props.list.id + '/edit' }
                   className="fa fa-pencil-square-o fa-2x text-warning"
                   style={{ marginRight: 1 + 'rem' }}></a>
              {/* method: :delete */}
                <a href="#"
                   className="fa fa-trash fa-2x text-danger"
                   data-confirm="Are you sure?"
                   onClick={ () => this.handleDelete(this.props.list.id) }></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
