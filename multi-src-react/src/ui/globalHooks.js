import { useEffect, useContext } from 'react';
import GlobalContext from '@leemons/contexts/global';

export default function useUi() {
  const context = useContext(GlobalContext);

  useEffect(() => {
    console.log('Welcome to Leemons, the UI Plugin is installed');
  }, []);

  useEffect(() => {
    // Replace the rest params with the ones specified in the options
    context.leemons.api.useReq(async (ctx) => {
      if (ctx.options.params) {
        ctx.url = Object.entries(ctx.options.params).reduce(
          (url, [key, value]) => url.replaceAll(`:${key}`, value),
          ctx.url
        );
      }
    });

    // Convert the response to json
    context.leemons.api.useRes(async (ctx) => {
      ctx.response = await ctx.response.json();
    });
    // Transform the response into a pokemon {name: string, abilities: string[]}
    context.leemons.api.useRes(async (ctx) => {
      ctx.response = {
        name: ctx.response.name,
        abilities: ctx.response.abilities.map(
          (ability) => ability.ability.name
        ),
      };
    });

    console.log('registering');
  }, []);
}
