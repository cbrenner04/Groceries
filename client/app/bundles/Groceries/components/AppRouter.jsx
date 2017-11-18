import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import EditGroceryListItemForm from './EditGroceryListItemForm';
import ListContainer from './ListContainer';
import ListEditForm from './ListEditForm';
import ListsContainer from './ListsContainer';
import ShareListForm from './ShareListForm';
import NewSession from './NewSession';
import NewRegistration from './NewRegistration';
import NewPassword from './NewPassword';
import EditPassword from './EditPassword';
import InviteForm from './InviteForm';
import EditInvite from './EditInvite';

export default function AppRouter() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={ListsContainer} />
        <Route exact path="/users" component={NewRegistration} />
        <Route exact path="/users/sign_in" component={NewSession} />
        <Route exact path="/users/password/new" component={NewPassword} />
        <Route exact path="/users/password/edit" component={EditPassword} />
        <Route exact path="/users/invitation/new" component={InviteForm} />
        <Route exact path="/users/invitation/accept" component={EditInvite} />
        <Route exact path="/lists" component={ListsContainer} />
        <Route exact path="/lists/:id" component={ListContainer} />
        <Route exact path="/lists/:id/edit" component={ListEditForm} />
        <Route
          exact
          path="/lists/:grocery_list_id/grocery_list_items/:id/edit"
          component={EditGroceryListItemForm}
        />
        <Route
          exact
          path="/lists/:list_id/users_lists/new"
          component={ShareListForm}
        />
      </div>
    </Router>
  );
}
