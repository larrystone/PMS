import { Location } from '../models'; //eslint-disable-line
import sendResponse from '../utils/sendResponse';
import { checkNumber } from '../utils/validator';

export default async (req, res, next) => {
  const { subLocationId } = req.body;

  const parsedSubLocation = checkNumber(subLocationId);
  if (!parsedSubLocation) {
    next();
  }

  try {
    const foundLocation = await Location.findOne({
      where: { id: subLocationId },
      attributes: ['name'],
    });

    if (!foundLocation) {
      sendResponse(res, 404, { message: 'subLocation not found in database' });
    } else {
      req.subLocationId = parsedSubLocation;
      next();
    }
  } catch (err) {
    sendResponse(res, 500, { message: 'Error searching subLocation in database' });
  }
};
