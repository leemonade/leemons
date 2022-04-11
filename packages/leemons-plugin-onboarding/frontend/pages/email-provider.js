import { useEffect, useState } from 'react';
import Router from 'next/router';

export default function EmailProvider() {
  const [providers, setProviders] = useState([]);

  async function getProviders() {
    try {
      const { providers: _providers } = await leemons.api('emails/providers');
      setProviders(_providers);
    } catch (err) {
      console.error('En el error', err);
    }
  }

  async function selectProvider(provider) {
    Router.push(`/onboarding/email-provider/${provider.providerName}`);
  }

  useEffect(() => {
    getProviders();
  }, []);

  return (
    <>
      <h1 className="h1">Selecciona un proveedor de email</h1>
      <div className="grid grid-cols-4">
        {providers.map((value) => (
          <div key={value.providerName} onClick={() => selectProvider(value)}>
            <img className="max-w-full" src={value.image} />
            <div className="text-center bg-red-50">{value.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
