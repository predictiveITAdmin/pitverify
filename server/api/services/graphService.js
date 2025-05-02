const { getGraphClient } = require('./masl');

async function getAllEmployeesBasic() {
  const client = getGraphClient();
  const response = await client.api('/users')
    .select('displayName,employeeId,id,accountEnabled,department,jobTitle,givenName,surname,mail,userPrincipalName')
    .top(999)
    .get();
  return response.value;
}

async function getEmployeeData(id) {
  const client = getGraphClient();
  const response = await client.api('/users')
    .filter(`id eq '${id}'`)
    .select('displayName,employeeId,id,jobTitle,mail,mobilePhone,officeLocation,department,accountEnabled,companyName,givenName,surname,preferredLanguage,userPrincipalName')
    .get();
  if (!response.value.length) {
    throw new Error('User not found');
  }
  return response.value[0];
}

module.exports = {
  getAllEmployeesBasic,
  getEmployeeData
};
