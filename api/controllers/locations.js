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
        {
          model: Location,
          as: 'subLocation',
        },
      ],
    };

    for (let i = 1; i < depth; i += 1) {
      include = {
        include: [{
          model: Location,
          as: 'subLocation',
          ...include,
        }],
      };
    }

    try {
      const data = await Location
        .findOne({
          where: { id },
          ...include,
        });
      if (data) {
        sendResponse(res, 200, {
          message: 'Success!',
          data,
        });
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
        const { name: subName, ...defaults } = subLocation;
        const [data] = await Location.findOrCreate({
          where: {
            name: subName,
          },
          defaults,
        });
        subLocationId = data.id;
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

      if (!location) {
        sendResponse(res, 404, { message: 'Location not found' });
      } else {
        const data = await location.updateAttributes({
          name, male: Number.parseInt(male, 10), female: Number.parseInt(female, 10), subLocationId,
        });

        sendResponse(res, 200, {
          message: 'Location updated',
          data,
        });
      }
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }

  static async deleteLocation({ params }, res) {
    const { id } = params;

    try {
      const location = await Location
        .findOne({ where: { id } });

      if (!location) {
        sendResponse(res, 404, { message: 'Location not found' });
      } else {
        await location.destroy();
        sendResponse(res, 200);
      }
    } catch (err) {
      sendResponse(res, 500, { err });
    }
  }
}

export default Locations;
