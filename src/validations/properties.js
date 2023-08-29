export function propertiesValidation(properties = [], body) {
  const missingProperties = []
  for(const propertie of properties){
    if(!body || !body[propertie]){
      missingProperties.push(`${propertie}: is missing`)
    }
  }

  return missingProperties
}