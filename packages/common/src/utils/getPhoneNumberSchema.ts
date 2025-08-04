import { CountryCode } from '../types';
import z from 'zod';

export function getPhoneNumberSchema(countryCode: CountryCode) {
  let regex: RegExp;

  switch (countryCode) {
    // Major countries with specific validation patterns
    case 'US':
    case 'CA':
      regex = /^(\+1|1)?[2-9][0-9]{9}$/;
      break;
    case 'TR':
      regex = /^(\+90|90|0)?[5][0-9]{9}$/;
      break;
    case 'JP':
      regex = /^(\+81|81|0)?[0-9]{10,11}$/;
      break;
    case 'DE':
      regex = /^(\+49|49|0)?[1-9][0-9]{10,11}$/;
      break;
    case 'FR':
      regex = /^(\+33|33|0)?[1-9][0-9]{8}$/;
      break;
    case 'IT':
      regex = /^(\+39|39|0)?[3][0-9]{8,9}$/;
      break;
    case 'ES':
      regex = /^(\+34|34|0)?[6-9][0-9]{8}$/;
      break;
    case 'NL':
      regex = /^(\+31|31|0)?[6][0-9]{8}$/;
      break;
    case 'BE':
      regex = /^(\+32|32|0)?[4][0-9]{8}$/;
      break;
    case 'SE':
      regex = /^(\+46|46|0)?[7][0-9]{8}$/;
      break;
    case 'NO':
      regex = /^(\+47|47|0)?[4-9][0-9]{7}$/;
      break;
    case 'DK':
      regex = /^(\+45|45|0)?[2-9][0-9]{7}$/;
      break;
    case 'FI':
      regex = /^(\+358|358|0)?[4-5][0-9]{7,8}$/;
      break;
    case 'EE':
      regex = /^(\+372|372|0)?[5][0-9]{6,7}$/;
      break;
    case 'LV':
      regex = /^(\+371|371|0)?[2][0-9]{7}$/;
      break;
    case 'LT':
      regex = /^(\+370|370|0)?[6][0-9]{7}$/;
      break;
    case 'PL':
      regex = /^(\+48|48|0)?[4-9][0-9]{8}$/;
      break;
    case 'CZ':
      regex = /^(\+420|420|0)?[4-9][0-9]{8}$/;
      break;
    case 'SK':
      regex = /^(\+421|421|0)?[9][0-9]{8}$/;
      break;
    case 'HU':
      regex = /^(\+36|36|0)?[1-9][0-9]{8}$/;
      break;
    case 'RO':
      regex = /^(\+40|40|0)?[7][0-9]{8}$/;
      break;
    case 'BG':
      regex = /^(\+359|359|0)?[8-9][0-9]{7,8}$/;
      break;
    case 'HR':
      regex = /^(\+385|385|0)?[9][0-9]{7,8}$/;
      break;
    case 'SI':
      regex = /^(\+386|386|0)?[3-9][0-9]{7}$/;
      break;
    case 'GB':
      regex = /^(\+44|44|0)?[7][0-9]{9}$/;
      break;
    case 'IE':
      regex = /^(\+353|353|0)?[8][0-9]{8}$/;
      break;
    case 'AU':
      regex = /^(\+61|61|0)?[4][0-9]{8}$/;
      break;
    case 'NZ':
      regex = /^(\+64|64|0)?[2][0-9]{7,9}$/;
      break;
    case 'BR':
      regex = /^(\+55|55|0)?[1-9][0-9]{10}$/;
      break;
    case 'MX':
      regex = /^(\+52|52|0)?[1-9][0-9]{9}$/;
      break;
    case 'AR':
      regex = /^(\+54|54|0)?[9][0-9]{8,10}$/;
      break;
    case 'IN':
      regex = /^(\+91|91|0)?[6-9][0-9]{9}$/;
      break;
    case 'CN':
      regex = /^(\+86|86|0)?[1][0-9]{10}$/;
      break;
    case 'KR':
      regex = /^(\+82|82|0)?[1][0-9]{8,9}$/;
      break;
    case 'RU':
      regex = /^(\+7|7|0)?[9][0-9]{9}$/;
      break;
    case 'ZA':
      regex = /^(\+27|27|0)?[6-8][0-9]{8}$/;
      break;
    case 'EG':
      regex = /^(\+20|20|0)?[1][0-9]{8,9}$/;
      break;
    case 'SA':
      regex = /^(\+966|966|0)?[5][0-9]{8}$/;
      break;
    case 'AE':
      regex = /^(\+971|971|0)?[5][0-9]{8}$/;
      break;
    case 'IL':
      regex = /^(\+972|972|0)?[5][0-9]{8}$/;
      break;
    case 'CH':
      regex = /^(\+41|41|0)?[7][0-9]{8}$/;
      break;
    case 'AT':
      regex = /^(\+43|43|0)?[6][0-9]{8,10}$/;
      break;
    case 'PT':
      regex = /^(\+351|351|0)?[9][0-9]{8}$/;
      break;
    case 'GR':
      regex = /^(\+30|30|0)?[6][0-9]{9}$/;
      break;

    // Default pattern for countries without specific validation
    default:
      // Generic international phone number pattern
      regex = /^(\+[1-9]\d{0,3}|[0-9]{1,4})?[0-9]{6,14}$/;
      break;
  }

  return z
    .string()
    .regex(regex, `Invalid phone number format for ${countryCode}`);
}

export function isValidPhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode
): boolean {
  try {
    const schema = getPhoneNumberSchema(countryCode);
    schema.parse(phoneNumber);
    return true;
  } catch {
    return false;
  }
}
