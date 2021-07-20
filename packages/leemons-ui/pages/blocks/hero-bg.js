import React from 'react';
import { HeroBg, Badge } from '../../src/components/ui';
import Wrapper from '../../src/components/Wrapper';

export default function HeroBgPage() {
  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Hero Background</span>
      </h2>

      <div className="flex-grow p-4">
        <div className="prose text-base-content mb-6">
          <p>
            In order to customize the Hero colors, you have to pass in the classeNames{' '}
            <Badge outlined>{'bg-{color}'}</Badge> to fill the Hero background and{' '}
            <Badge outlined>{'text-{color}'}</Badge> to fill the animated shapes.
          </p>
        </div>

        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="large (lg)">
          <div className="flex flex-col border border-base-200">
            <section className="relative">
              <HeroBg type="lg" className="h-auto w-full bg-secondary text-secondary-300" />
              <div className="absolute top-0 lef-0 w-full h-full">
                <div className="flex flex-col h-full p-4 text-white">
                  <div className="text-lg font-medium">leemons</div>
                  <div className="flex flex-col flex-grow max-w-xs place-content-center">
                    <p className="font-inter font-medium leading-none">
                      <em>
                        “I don’t know the meaning of half those long words, and, what’s more, I
                        don’t believe you do either!”
                      </em>
                    </p>
                    <div className="text-xs leading-none mt-4">
                      <span className="block">Alice in Wonderland</span>
                      <span>Lewis Carrol</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-4">Bottom content</section>
          </div>
        </Wrapper>

        <Wrapper title="medium horizontal (x-md) + Speed">
          <div className="flex flex-row h-96 border border-base-200">
            <section className="relative">
              <HeroBg
                type="x-md"
                speed={100}
                className="h-full w-auto bg-primary text-primary-200"
              />
              <div className="absolute top-0 lef-0 w-full h-full">
                <div className="flex flex-col h-full p-4 text-black">
                  <div className="text-lg font-medium">leemons</div>
                  <div className="flex flex-col flex-grow place-content-center">
                    <p className="font-inter font-medium leading-none">
                      <em>
                        “I don’t know the meaning of half those long words, and, what’s more, I
                        don’t believe you do either!”
                      </em>
                    </p>
                    <div className="text-xs leading-none mt-4">
                      <span className="block">Alice in Wonderland</span>
                      <span>Lewis Carrol</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-4">Right content</section>
          </div>
        </Wrapper>

        <Wrapper title="Small horizontal (x-sm) + Decay">
          <div className="flex flex-row h-96 border border-base-200">
            <section className="relative">
              <HeroBg type="x-sm" decay={2} className="h-full w-auto bg-pink-400 text-white" />
              <div className="absolute top-0 lef-0 w-full h-full">
                <div className="flex flex-col h-full p-4 text-black">
                  <div className="text-lg font-medium">leemons</div>
                  <div className="flex flex-col flex-grow place-content-center">
                    <p className="font-inter font-medium leading-none">
                      <em>
                        “I don’t know the meaning of half those long words, and, what’s more, I
                        don’t believe you do either!”
                      </em>
                    </p>
                    <div className="text-xs leading-none mt-4">
                      <span className="block">Alice in Wonderland</span>
                      <span>Lewis Carrol</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-4">Right content</section>
          </div>
        </Wrapper>

        <Wrapper title="no animation">
          <div className="flex flex-row h-96 border border-base-200">
            <section className="relative">
              <HeroBg
                type="x-sm"
                animate={false}
                className="h-full w-auto bg-yellow-400 text-yellow-100"
              />
              <div className="absolute top-0 lef-0 w-full h-full">
                <div className="flex flex-col h-full p-4 text-black">
                  <div className="text-lg font-medium">leemons</div>
                  <div className="flex flex-col flex-grow place-content-center">
                    <p className="font-inter font-medium leading-none">
                      <em>
                        “I don’t know the meaning of half those long words, and, what’s more, I
                        don’t believe you do either!”
                      </em>
                    </p>
                    <div className="text-xs leading-none mt-4">
                      <span className="block">Alice in Wonderland</span>
                      <span>Lewis Carrol</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-4">Right content</section>
          </div>
        </Wrapper>
      </div>
    </main>
  );
}
