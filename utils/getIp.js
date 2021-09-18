import fetch from 'node-fetch'

export const getLocation = async (ip) => {
  const ipR = await fetch(
      `https://flacialutils.freedomains.dev/api/ip/${ip.replaceAll('f', '').replaceAll(':', '')}`)
  const {
      ipInfo
  } = await ipR.json()

  return ipInfo
}