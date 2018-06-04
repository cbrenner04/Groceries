import moment from 'moment';

const formatDate = date => moment(date).format('MMMM DD YYYY, h:mm:ss a');
const defaultDueBy = () => moment().format('YYYY-MM-DD');
const formatDueBy = date => moment(date).format('YYYY-MM-DD');
const prettyDueBy = date => moment(date).format('LL');

export { formatDate, defaultDueBy, formatDueBy, prettyDueBy };
