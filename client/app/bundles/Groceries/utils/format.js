import moment from 'moment';

export var formatDate = function(date) {
  return moment(date).format('MMMM DD YYYY, h:mm:ss a');
};
