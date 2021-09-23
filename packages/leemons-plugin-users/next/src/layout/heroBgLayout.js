import { HeroBg, ImageLoader, Logo } from 'leemons-ui';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import prefixPN from '@users/helpers/prefixPN';

export default function HeroBgLayout({ children }) {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('hero_bg') });
  const t = tLoader(prefixPN('hero_bg'), translations);

  return (
    <>
      <div className="flex h-screen">
        <div className="relative flex">
          <HeroBg
            style={{ backgroundColor: '#F4E6E6' }}
            type="x-md"
            speed={500}
            className="h-full w-auto text-primary-200"
          />

          <Logo className="absolute left-8 top-8" />

          <div
            style={{ width: '294.58px', height: '414px', maxWidth: '40%', maxHeight: '40%' }}
            className="absolute right-20 bottom-20"
          >
            <ImageLoader className="object-contain" src="/assets/login/child.png" />
          </div>

          <div className="absolute left-6 right-6 top-1/3 transform -translate-y-1/4 max-w-sm">
            <div className="text-3xl text-secondary italic">{t('text')}</div>
            <div
              className="text-secondary text-xl mt-7"
              dangerouslySetInnerHTML={{
                __html: t('author'),
              }}
            />
          </div>
        </div>
        <div className="w-7/12 relative">
          <div
            style={{ maxWidth: '360px' }}
            className="w-full absolute left-1/4 top-2/4 transform -translate-y-2/4"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
