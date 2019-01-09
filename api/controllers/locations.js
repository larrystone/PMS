import { Location } from '../models'; //eslint-disable-line
import sendResponse from '../utils/sendResponse';

class Locations {
  static async getLocations(req, res) {
    try {
      const data = await Location.findAll();
      sendResponse(res, 200, { message: 'Success', data });
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }

  static async getLocation({ params, query }, res) {
    const { id } = params;
    const depth = Number.parseInt(query.depth, 10) || 1;

    let include = {
      include: [
        { model: Location, as: 'subLocation' },
      ],
    };

    for (let k = 1; k < depth; k += 1) {
      include = {
        include: [
          {
            model: Location,
            as: 'subLocation',
            ...include,
          },
        ],
      };
    }

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

  static async createLocation(req, res) {
    const {
      name, male, female, subLocation,
    } = req.body;

    try {
      let { subLocationId } = req.body;
      if (subLocation) {
        const { name: subName, ...rest } = subLocation;
        const [{ id }] = await Location.findOrCreate({
          where: {
            name: subName,
          },
          defaults: { rest },
        });
        subLocationId = id;
      }
      const [data, created] = await Location.findOrCreate({
        where: {
          name,
        },
        defaults: {
          male, female, subLocationId,
        },
      });
      sendResponse(res, 201, {
        message: created ? 'New Location created' : 'Location already exist',
        data,
      });
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }

  static async updateLocation({ body, params }, res) {
    const {
      name, male, female, subLocationId,
    } = body;

    const { id } = params;

    try {
      const location = await Location.findOne({
        where: { id },
      });

      const updatedLocation = await location.updateAttributes({
        name, male, female, subLocationId,
      });

      sendResponse(res, 200, { data: updatedLocation });
    } catch (err) {
      sendResponse(res, 500, { err });
    }

    res.status(200).json({
      message: 'All correct',
    });
  }

  static async deleteLocation({ params }, res) {
    const { id } = params;

    try {
      const data = await Location
        .findOne({ where: { id } });

      if (!data) {
        sendResponse(res, 404, { message: 'Location not found' });
      } else {
        await data.destroy();
        sendResponse(res, 200);
      }
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }
}

export default Locations;
