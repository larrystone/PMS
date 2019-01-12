import sendResponse from '../utils/sendResponse';

export default ({ params }, res, next) => {
  const { id } = params;

  if (Number.parseInt(id, 10)) {
    next();
  } else {
    sendResponse(res, 422, { message: 'Invalid Location ID provided' });
  }
};
