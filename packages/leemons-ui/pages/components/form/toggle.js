import React from 'react';
import { FormControl, Toggle, Divider } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function TogglePage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'toggle', desc: 'For checkbox' },
      { class: 'toggle-mark', desc: 'For span that coms after checkbox' },
    ],
    utilities: [
      { class: 'toggle-primary', desc: 'Adds `primary` to toggle' },
      { class: 'toggle-secondary', desc: 'Adds `secondary` to toggle' },
      { class: 'toggle-accent', desc: 'Adds `accent` to toggle' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Toggle</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="toggle + label position" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <div className="flex">
              <FormControl label="Remember me" labelPosition="right">
                <Toggle />
              </FormControl>
            </div>
          </div>
        </Wrapper>

        <Wrapper
          title="toggle primary + label position + custom label"
          className="flex flex-col space-y-2 max-w-md"
        >
          <div className="p-6 card bordered shadow-lg">
            <div className="flex">
              <FormControl
                label={
                  <>
                    I have read and accept the{' '}
                    <a href="#" className="text-primary">
                      terms and conditions
                    </a>
                  </>
                }
                labelPosition="right"
              >
                <Toggle color="primary" />
              </FormControl>
            </div>
          </div>
        </Wrapper>
        <Wrapper title="toggle secondary" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Remember me">
              <Toggle color="secondary" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="toggle accent" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Remember me">
              <Toggle color="accent" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="toggle disabled" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Disabled + unchecked">
              <Toggle color="accent" disabled />
            </FormControl>
            <FormControl label="Disabled + checked">
              <Toggle color="accent" checked disabled />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="toggle + errors" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <div className="flex">
              <FormControl
                label="Accept terms"
                labelPosition="right"
                formError={{ message: 'Must accept terms', type: 'required' }}
              >
                <Toggle color="error" />
              </FormControl>
            </div>
          </div>
        </Wrapper>

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TogglePage;
