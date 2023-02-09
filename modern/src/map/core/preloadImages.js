import palette from '../../common/theme/palette';
import { loadImage, prepareIcon } from './mapUtil';

import defaultSvg from '../../resources/images/icon/default.svg';
import directionSvg from '../../resources/images/direction.svg';
import backgroundSvg from '../../resources/images/background.svg';
import boatSvg from '../../resources/images/icon/boat.svg';
import busSvg from '../../resources/images/icon/bus.svg';
import carSvg from '../../resources/images/icon/car.svg';
import craneSvg from '../../resources/images/icon/crane.svg';
import motorcycleSvg from '../../resources/images/icon/motorcycle.svg';
import personSvg from '../../resources/images/icon/person.svg';
import pickupSvg from '../../resources/images/icon/pickup.svg';
import tractorSvg from '../../resources/images/icon/tractor.svg';
import trainSvg from '../../resources/images/icon/train.svg';
import truckSvg from '../../resources/images/icon/truck.svg';
import vanSvg from '../../resources/images/icon/van.svg';
import boomliftSvg from '../../resources/images/icon/boomlift.svg';
import catSvg from '../../resources/images/icon/cat.svg';
import dogSvg from '../../resources/images/icon/dog.svg';
import droneSvg from '../../resources/images/icon/drone.svg';
import firetruckSvg from '../../resources/images/icon/firetruck.svg';
import foodtruckSvg from '../../resources/images/icon/foodtruck.svg';
import schoolvanSvg from '../../resources/images/icon/schoolvan.svg';
import securitycarSvg from '../../resources/images/icon/securitycar.svg';
import skyjackSvg from '../../resources/images/icon/skyjack.svg';
import suvSvg from '../../resources/images/icon/suv.svg';

export const mapIcons = {
  default: defaultSvg,
  boat: boatSvg,
  boomlift: boomliftSvg,
  bus: busSvg,
  car: carSvg,
  cat: catSvg,
  crane: craneSvg,
  dog: dogSvg,
  drone: droneSvg,
  firetruck: firetruckSvg,
  foodtruck: foodtruckSvg,
  motorcycle: motorcycleSvg,
  person: personSvg,
  pickup: pickupSvg,
  schoolvan: schoolvanSvg,
  securitycar: securitycarSvg,
  skyjack: skyjackSvg,
  suv: suvSvg,
  tractor: tractorSvg,
  train: trainSvg,
  truck: truckSvg,
  van: vanSvg,
};

export const mapIconKey = (category) => (mapIcons.hasOwnProperty(category) ? category : 'default');

export const mapImages = {};

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));
  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];
    ['primary', 'positive', 'negative', 'neutral'].forEach((color) => {
      results.push(loadImage(mapIcons[category]).then((icon) => {
        mapImages[`${category}-${color}`] = prepareIcon(background, icon, palette.colors[color]);
      }));
    });
    await Promise.all(results);
  }));
};
