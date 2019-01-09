import { Location } from '../models'; //eslint-disable-line
import sendResponse from '../utils/sendResponse';

class Locations {
  static async getLocations(req, res) {
    try {
      const data = await Location.findAll();
      sendResponse(res, 200, { message: 'All correct', data });
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }

  static async getLocation({ params, query }, res) {
    const { id } = params;
    const { depth = 1 } = query;

    let include = {
      include: [
        { model: Location, as: 'subLocation' },
      ],
    };

    for (let k = 1; k < Number.parseInt(depth, 10) || 1; k += 1) {
      include = {
        include: [
          {
            model: Location,
            as: 'subLocation',
            // ...include,
          },
        ],
      };
    }

    console.log('======', include, depth);
    try {
      const data = await Location
        .findOne({
          where: { id },
          ...include,
        });
      if (data) {
        sendResponse(res, 200, data);
      } else {
        sendResponse(res, 404, { message: 'Location not found' });
      }
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }

  static createLocation(req, res) {
    const { name, subLocationId } = req.body;

    Location.create({ name, subLocationId });
    res.status(201).json({
      message: 'All correct',
    });
  }

  static updateLocation(req, res) {
    res.status(200).json({
      message: 'All correct',
    });
  }

  static async deleteLocation({ params }, res) {
    const { id } = params;

    try {
      const data = await Location.findById(id).destroy();
      console.log('====', data);
      sendResponse(res, 200);
    } catch (err) {
      sendResponse(res, 500, { err });
    }
    res.status(200).json({
      message: 'All correct',
    });
  }
}

export default Locations;
