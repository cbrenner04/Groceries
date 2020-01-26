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
    handleCategoryFilter: PropTypes.func.isRequired,
    handleClearFilter: PropTypes.func.isRequired,
    filter: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    notPurchasedItems: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
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
    }).isRequired)).isRequired,
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
    filter: '',
    categories: [''],
  }

  onItemUnPurchase = item => this.props.handleItemUnPurchase(item);

  handlePurchase = item => this.props.handlePurchaseOfItem(item);

  handleRead = item => this.props.handleReadOfItem(item);

  handleUnRead = item => this.props.handleUnReadOfItem(item);

  handleDeletion = item => this.props.handleItemDelete(item);

  completedTitle = () => (this.props.listType === 'ToDoList' ? 'Completed' : 'Purchased');

  render() {
    return (
      <div>
        <div className="clearfix">
          <h2 className="float-left">Items</h2>
          {!this.props.categories.length &&
            <button
              className="btn btn-light dropdown-toggle float-right"
              type="button"
              id="filter-by-category-button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              disabled
              style={{ cursor: 'not-allowed' }}
            >
              Filter by category
            </button>}
          {!!this.props.categories.length && !this.props.filter &&
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
                {this.props.categories.sort().map((category) => {
                  if (!category) return '';
                  return (
                    <button
                      key={category}
                      name={category}
                      onClick={this.props.handleCategoryFilter}
                      className="dropdown-item"
                      style={{ cursor: 'pointer' }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>}
          {this.props.filter &&
            <div className="float-right">
              <span style={{ lineHeight: '2.5rem', marginRight: '1rem' }}>Filtering by:</span>
              <button
                id="clear-filter-button"
                type="button"
                className="btn btn-outline-primary"
                style={{ marginRight: '1rem' }}
                onClick={this.props.handleClearFilter}
              >
                {this.props.filter} <i className="fa fa-trash" />
              </button>
            </div>}
        </div>
        {(this.props.filter || !this.props.categories.length) &&
          <div>
            <ListItems
              category={this.props.filter}
              items={this.props.notPurchasedItems[this.props.filter]}
              onItemPurchase={this.handlePurchase}
              onItemRead={this.handleRead}
              onItemUnRead={this.handleUnRead}
              onItemDelete={this.handleDeletion}
              listType={this.props.listType}
              listUsers={this.props.listUsers}
              permission={this.props.permission}
            />
          </div>}
        {!this.props.filter && this.props.categories.sort().map(category => (
          <div key={category}>
            <ListItems
              category={category}
              items={this.props.notPurchasedItems[category]}
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
