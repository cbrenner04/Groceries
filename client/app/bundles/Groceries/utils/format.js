import moment from 'moment';

const formatDate = date => moment(date).format('MMMM DD YYYY, h:mm:ss a');
export default formatDate;
