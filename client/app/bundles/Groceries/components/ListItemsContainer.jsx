import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListItems from '../components/ListItems';

export default class ListItemsContainer extends Component {
  static propTypes = {
    handleItemDelete: PropTypes.func.isRequired,
    handlePurchaseOfItem: PropTypes.func.isRequired,
    handleReadOfItem: PropTypes.func.isRequired,
    handleUnReadOfItem: PropTypes.func.isRequired,
    handleItemUnPurchase: PropTypes.func.isRequired,
    // I want to have prop type validations but I only use these in getDerivedStateFromProps
    // eslint-disable-next-line react/no-unused-prop-types
    notPurchasedItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.category,
    }).isRequired).isRequired,
    purchasedItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.category,
    }).isRequired).isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
    })),
    permission: PropTypes.string.isRequired,
  }

  static defaultProps = {
    listUsers: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      notPurchasedItems: [],
      filter: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.notPurchasedItems !== state.notPurchasedItems && !state.filter) {
      return {
        notPurchasedItems: props.notPurchasedItems,
      };
    }
    return null;
  }

  onItemUnPurchase = item => this.props.handleItemUnPurchase(item);

  handlePurchase = item => this.props.handlePurchaseOfItem(item);

  handleRead = item => this.props.handleReadOfItem(item);

  handleUnRead = item => this.props.handleUnReadOfItem(item);

  handleDeletion = item => this.props.handleItemDelete(item);

  completedTitle = () => (this.props.listType === 'ToDoList' ? 'Completed' : 'Purchased');

  categories = () => {
    const cats = [''];
    this.state.notPurchasedItems.forEach((item) => {
      if (!item.category) return;
      const cat = item.category.toLowerCase();
      const key = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!cats.includes(key)) cats.push(key);
    });
    return cats;
  }

  categorizedNotPurchasedItems = () => {
    const obj = [];
    this.categories().forEach((cat) => {
      obj[cat] = [];
    });
    this.state.notPurchasedItems.forEach((item) => {
      if (!item.category) {
        obj[''].push(item);
        return;
      }
      const cat = item.category.toLowerCase();
      const key = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!obj[key]) obj[key] = [];
      obj[key].push(item);
    });
    return obj;
  }

  handleCategoryFilter = (event) => {
    const filter = event.target.name.toLowerCase();
    const filteredItems = this.state.notPurchasedItems.filter(item => item.category === filter);
    this.setState({
      notPurchasedItems: filteredItems,
      filter,
    });
  }

  handleClearFilter = () => {
    this.setState({
      filter: '',
    });
  }

  render() {
    return (
      <div>
        <div className="clearfix">
          <h2 className="float-left">Items</h2>
          {!!this.categories().filter(cat => !!cat).length &&
            <div className="dropdown float-right">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                id="filter-by-category-button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Filter by category
              </button>
              <div className="dropdown-menu" aria-labelledby="filter-by-category-button">
                {this.categories().sort().map(category => (
                  <button
                    key={category}
                    name={category}
                    onClick={this.handleCategoryFilter}
                    className="dropdown-item"
                    style={{ cursor: 'pointer' }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>}
          {this.state.filter &&
            <button
              id="clear-filter-button"
              type="button"
              className="btn btn-outline-primary float-right"
              style={{ marginRight: '1rem' }}
              onClick={this.handleClearFilter}
            >
              <i className="fa fa-trash" /> {this.state.filter}
            </button>}
        </div>
        {this.categories().sort().map(category => (
          <div key={category}>
            <ListItems
              category={category}
              items={this.categorizedNotPurchasedItems()[category]}
              onItemPurchase={this.handlePurchase}
              onItemRead={this.handleRead}
              onItemUnRead={this.handleUnRead}
              onItemDelete={this.handleDeletion}
              listType={this.props.listType}
              listUsers={this.props.listUsers}
              permission={this.props.permission}
            />
            <br />
          </div>
        ))}
        <br />
        <h2>{this.completedTitle()}</h2>
        <ListItems
          items={this.props.purchasedItems}
          handleItemUnPurchase={this.onItemUnPurchase}
          onItemDelete={this.handleDeletion}
          listType={this.props.listType}
          listUsers={this.props.listUsers}
          onItemRead={this.handleRead}
          onItemUnRead={this.handleUnRead}
          purchased
          permission={this.props.permission}
        />
      </div>
    );
  }
}
