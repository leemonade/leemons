/*
 * @params {request} extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
function getAppCookies(req) {
  const parsedItems = {};
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ');
    cookiesItems.forEach((cookies) => {
      const parsedItem = cookies.split('=');
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
  }
  return parsedItems;
}

async function getSession({ req }) {
  const { token } = getAppCookies(req);
  const user = await fetch('users-groups-roles/user', {
    headers: { Authorization: token },
  }).then((r) => r);
  console.log(user);
  return user;
}

export default getSession;
