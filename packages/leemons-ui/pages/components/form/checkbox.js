import React from 'react';
import { Checkbox, Divider, FormControl } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function CheckboxPage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'checkbox', desc: 'For checkbox' },
      { class: 'checkbox-mark', desc: 'For span that coms after checkbox' },
    ],
    utilities: [
      { class: 'checkbox-primary', desc: 'Adds `primary` to checkbox' },
      { class: 'checkbox-secondary', desc: 'Adds `secondary` to checkbox' },
      { class: 'checkbox-accent', desc: 'Adds `accent` to checkbox' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Checkbox</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="checkbox + label position" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <div className="flex">
              <FormControl label="Remember me" labelPosition="right">
                <Checkbox color="primary" />
              </FormControl>
            </div>
          </div>
        </Wrapper>

        <Wrapper
          title="checkbox primary + label position + custom label"
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
                <Checkbox color="primary" />
              </FormControl>
            </div>
          </div>
        </Wrapper>
        <Wrapper title="checkbox secondary" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Remember me">
              <Checkbox color="secondary" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="checkbox accent" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Remember me">
              <Checkbox color="accent" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="checkbox disabled" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered shadow-lg">
            <FormControl label="Disabled + unchecked">
              <Checkbox color="accent" disabled />
            </FormControl>
            <FormControl label="Disabled + checked">
              <Checkbox color="accent" checked disabled />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="checkbox with error" className="flex flex-col space-y-2 max-w-xs">
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
                formError={{ message: 'Must accept the terms', type: 'required' }}
              >
                <Checkbox color="error" />
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

export default CheckboxPage;
