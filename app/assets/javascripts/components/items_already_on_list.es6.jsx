class ItemsAlreadyOnList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: props.items
    }
  }

  render() {
    return (
      <div>
        <h2>Items already on list</h2>

        <ul>
          {
            this.props.items.map((item) => {
              return (
                <li key={ item.id }>{ item.name }</li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
