import { getLocalizations } from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';

async function getProfileTranslations(profileId, locale) {
  const name = prefixPN(`profile.${profileId}.name`);
  const description = prefixPN(`profile.${profileId}.description`);
  const { items } = await getLocalizations({
    keys: [name, description],
    locale,
  });
  return {
    name: items[name] || '',
    description: items[description] || '',
  };
}

export default getProfileTranslations;
