import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import EditInvite from './EditInvite';
import EditListItemForm from './EditListItemForm';
import EditPassword from './EditPassword';
import InviteForm from './InviteForm';
import ListContainer from './ListContainer';
import ListEditForm from './ListEditForm';
import ListsContainer from './ListsContainer';
import Navbar from './Navbar';
import NewPassword from './NewPassword';
import NewSession from './NewSession';
import ShareListForm from './ShareListForm';

export default function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="*" component={Navbar} />
        <Route exact path="/" component={ListsContainer} />
        <Route exact path="/lists" component={ListsContainer} />
        <Route exact path="/lists/:id" component={ListContainer} />
        <Route exact path="/lists/:id/edit" component={ListEditForm} />
        <Route path="/lists/:list_id/*/:id/edit" component={EditListItemForm} />
        <Route
          exact
          path="/lists/:list_id/users_lists/new"
          component={ShareListForm}
        />
        <Route exact path="/users/sign_in" component={NewSession} />
        <Route exact path="/users/password/new" component={NewPassword} />
        <Route exact path="/users/password/edit" component={EditPassword} />
        <Route exact path="/users/invitation/new" component={InviteForm} />
        <Route exact path="/users/invitation/accept" component={EditInvite} />
      </div>
    </Router>
  );
}
