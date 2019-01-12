import { Location } from '../models'; //eslint-disable-line
import sendResponse from '../utils/sendResponse';
import { validateLocation } from '../utils/validator';

class Locations {
  static async getLocations(req, res) {
    try {
      const data = await Location.findAll();
      return sendResponse(res, 200, { message: 'Success', data });
    } catch (err) {
      return sendResponse(res, 500, { err });
    }
  }

  static async getLocation({ params, query }, res) {
    const { id } = params;
    const depth = Number.parseInt(query.depth, 10) || 1;

    const maxDepth = depth > 4 ? 4 : depth;

    let include = {
      include: [
        {
          model: Location,
          as: 'subLocation',
        },
      ],
    };

    for (let i = 1; i < maxDepth; i += 1) {
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
        return sendResponse(res, 200, {
          message: 'Success!. Max depth of 4 supported',
          data,
        });
      }
      return sendResponse(res, 404, { message: 'Location not found' });
    } catch (err) {
      return sendResponse(res, 500, { err });
    }
  }

  static async createLocation(req, res) {
    const parsedData = validateLocation(req.body);
    if (!parsedData) {
      return sendResponse(res, 400, { message: 'Invalid location data provided!' });
    }
    const {
      name, male, female, subLocation,
    } = parsedData;

    try {
      let { subLocationId } = req;

      if (!subLocationId && subLocation) {
        const parsedSubData = validateLocation(subLocation);

        if (!parsedSubData) {
          return sendResponse(res, 400, { message: 'Invalid sub location data provided!' });
        }

        const { name: subName, male: subMale, female: subFemale } = parsedSubData;
        const [data] = await Location.findOrCreate({
          where: {
            name: subName,
          },
          defaults: { male: subMale, female: subFemale },
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
      return sendResponse(res, created ? 201 : 409, {
        message: created ? 'New Location created' : 'Location already exist',
        data,
      });
    } catch (err) {
      return sendResponse(res, 500, { err });
    }
  }

  static async updateLocation({ body, params, subLocationId }, res) {
    const parsedData = validateLocation(body);
    if (!parsedData) {
      return sendResponse(res, 400, { message: 'Invalid location data provided!' });
    }

    const { id } = params;

    try {
      const location = await Location.findOne({
        where: { id },
      });

      const {
        name, male, female,
      } = parsedData;

      if (!location) {
        return sendResponse(res, 404, { message: 'Location not found' });
      }
      const data = await location.updateAttributes({
        name, male, female, subLocationId: subLocationId || location.subLocationId,
      });

      return sendResponse(res, 200, {
        message: 'Location updated',
        data,
      });
    } catch (err) {
      return sendResponse(res, 500, { err });
    }
  }

  static async deleteLocation({ params }, res) {
    const { id } = params;

    try {
      const location = await Location
        .findOne({ where: { id } });

      if (!location) {
        return sendResponse(res, 404, { message: 'Location not found' });
      }

      await location.destroy();
      return sendResponse(res, 200);
    } catch (err) {
      return sendResponse(res, 500, { err });
    }
  }
}

export default Locations;
