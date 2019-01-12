import sendResponse from '../utils/sendResponse';

const validateId = ({ params }, res, next) => {
  const { id } = params;

  if (Number.parseInt(id, 10)) {
    next();
  } else {
    sendResponse(res, 422, { message: 'Invalid Location ID provided' });
  }
};

export default validateId;
