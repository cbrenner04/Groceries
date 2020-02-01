import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import CompletedLists from './components/CompletedLists';
import EditInvite from './components/EditInvite';
import EditListItemForm from './components/EditListItemForm';
import EditPassword from './components/EditPassword';
import InviteForm from './components/InviteForm';
import ListContainer from './components/ListContainer';
import ListEditForm from './components/ListEditForm';
import ListsContainer from './components/ListsContainer';
import Navbar from './components/Navbar';
import NewPassword from './components/NewPassword';
import NewSession from './components/NewSession';
import ShareListForm from './components/ShareListForm';

export default function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="*" component={Navbar} />
        <Route exact path="/" component={ListsContainer} />
        <Route exact path="/completed_lists" component={CompletedLists} />
        <Route exact path="/lists" component={ListsContainer} />
        <Route exact path="/lists/:id" component={ListContainer} />
        <Route exact path="/lists/:id/edit" component={ListEditForm} />
        <Route path="/lists/:list_id/*/:id/edit" component={EditListItemForm} />
        <Route exact path="/lists/:list_id/users_lists" component={ShareListForm} />
        <Route exact path="/users/sign_in" component={NewSession} />
        <Route exact path="/users/password/new" component={NewPassword} />
        <Route exact path="/users/password/edit" component={EditPassword} />
        <Route exact path="/users/invitation/new" component={InviteForm} />
        <Route exact path="/users/invitation/accept" component={EditInvite} />
      </div>
    </Router>
  );
}
