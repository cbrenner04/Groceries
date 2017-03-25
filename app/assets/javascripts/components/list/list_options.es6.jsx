class ListOptions extends React.Component {
  render() {
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-secondary dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Options
        </button>
        <div className="dropdown-menu">
          <button href={ `/lists/${this.props.list.id}/edit` }
                  className="dropdown-item" type="button">Edit</button>
        {/* needs method: :delete */}
          <button href={ `/lists/${this.props.list.id}` }
                  className="dropdown-item"
                  type="button" data-confirm="Are you sure?">Destroy</button>
          <button className="dropdown-item" type="button">
            Created: { this.props.list.created_at }
          </button>
        {/* `last_item_updated` won't work like this as its not on the object */}
          <button className="dropdown-item" type="button">
            Last updated: { this.props.list.last_item_update }
          </button>
        </div>
      </div>
    )
  }
}
