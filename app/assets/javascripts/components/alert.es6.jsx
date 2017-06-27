class Alert extends React.Component{
  render() {
    return (
      <div className={`alert alert-${ this.props.alert_class }` +
                      `alert-dismissible fade show`} role="alert">
        <button type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        { this.props.text }
      </div>
    )
  }
}