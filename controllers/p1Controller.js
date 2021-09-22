import fetch from 'node-fetch';
import fs from 'fs';
import renderP1 from '../utils/renderP1.js';
import { v4 as uuid4 } from 'uuid'

class Visitors {
  constructor() {
    this.storage = this.initStorage();
  }

  initStorage() {
    if (!fs.existsSync('./store')) {
      fs.mkdirSync('./store', (err) => {
        throw new Error(err);
      });
    }

    if (!fs.existsSync('./store/visitors.json')) {
      fs.writeFileSync('./store/visitors.json', '{}', (err) => {
        throw new Error(err);
      });
    }

    return JSON.parse(fs.readFileSync('./store/visitors.json', 'utf-8')) || {};
  }

  getLocation = async (ip) => {
    const ipR = await fetch(
        `https://flacialutils.freedomains.dev/api/ip/${ip.replaceAll('f', '').replaceAll(':', '')}`)
    const {
        ipInfo
    } = await ipR.json()
  
    return ipInfo
  }

  updateStorage = () => {
    fs.writeFileSync('./store/visitors.json', JSON.stringify(this.storage), (err) => {
      throw new Error(err);
    });
  }

  modifyCountryVisitors = (country, coordinates) => {
    this.storage[country] = { count: this.storage?.[country]?.count + 1 || 1, coordinates };
    this.updateStorage();
  }

  requestPathUrl(req) { return `${req.protocol}://${req.get('host')}/p1/visitors/city`; }

  handleIpLocation = async (req, res) => {
    try {
      res.set('Cache-Control', 'max-age=3000');
      let {
        coordinates,
        region,
        city,
        country,
      } = await this.getLocation('72.229.28.185' || req.get('x-forwarded-for'));

      if (!city) city = country;

      if (!req.session.privateId) {
        req.session.privateId = uuid4();
        this.modifyCountryVisitors(`${region ? `${region},` : ''} ${country}`, coordinates);
      }

      res.send(renderP1(this.storage, city, coordinates, this.requestPathUrl(req)));
    } catch (err) {
      res.status(500).send({
        message: `API error due to: ${err}`,
      });
    }
  }

  handlePrevLocation = async (req, res) => {
    res.set('Cache-Control', 'max-age=3000');

    let {
      city,
      country,
    } = await this.getLocation('72.229.28.185' || req.get('x-forwarded-for'));
    if (!city) city = country;

    const coordinates = this.storage[req.params.cityName]?.coordinates;

    if (coordinates) {
      return res.send(renderP1(this.storage, city, coordinates, this.requestPathUrl(req)));
    }

    res.status(404).send({
      message: 'Country not found',
    });
  }
}

export default Visitors;
