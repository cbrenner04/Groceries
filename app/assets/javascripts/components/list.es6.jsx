const List = ({ list }) =>
  <div className="list-group">
    <a href={ "/lists/" + list.id }
       className="list-group-item list-group-item-action flex-column align-items-start">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">{ list.name }</h5>
        <small className="text-muted">{ formatDate(list.created_at) }</small>
      </div>
    </a>
  </div>
