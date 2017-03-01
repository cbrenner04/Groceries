const Lists = ({ lists }) =>
  <div>
    {
      lists.map((list) => {
        return (<List list={ list } key={ list.id } />)
      })
    }
  </div>
