function getDomainHost(domain) {
  if (domain === 'localhost') {
    return 'http://localhost:3000';
  }
  return `https://${domain}`;
}

/**
 * Get the deployment domains
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx - The context
 */
async function getDeploymentDomains({ ctx }) {
  const { domains } = await ctx.tx.call('deployment-manager.getDeployment');

  return {
    domains,
    callbackURLs: domains.map((domain) => `${getDomainHost(domain)}/users/login`),
    logoutURLs: domains.map((domain) => `${getDomainHost(domain)}/users/logout`),
  };
}

module.exports = getDeploymentDomains;
