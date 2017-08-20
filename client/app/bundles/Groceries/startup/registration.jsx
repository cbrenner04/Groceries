import ReactOnRails from 'react-on-rails';

import Alert from '../components/Alert';
import EditItemForm from '../components/EditItemForm';
import ListContainer from '../components/ListContainer';
import ListsContainer from '../components/ListsContainer';
import ListEditForm from '../components/ListEditForm';
import Navbar from '../components/Navbar';
import NewRegistration from '../components/NewRegistration';
import ShareListForm from '../components/ShareListForm';
import NewSession from '../components/NewSession';
import NewPassword from '../components/NewPassword';
import EditPassword from '../components/EditPassword';

ReactOnRails.register({
  Alert,
  EditItemForm,
  EditPassword,
  ListContainer,
  ListsContainer,
  ListEditForm,
  Navbar,
  NewPassword,
  NewRegistration,
  NewSession,
  ShareListForm,
});
