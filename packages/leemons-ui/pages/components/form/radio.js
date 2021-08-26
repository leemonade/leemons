import React from 'react';
import { FormControl, Radio, Divider, Label } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function RadioPage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'radio', desc: 'For radio input' },
      { class: 'radio-mark', desc: 'For span that coms after radio input' },
    ],
    utilities: [
      { class: 'radio-primary', desc: 'Adds `primary` to radio' },
      { class: 'radio-secondary', desc: 'Adds `secondary` to radio' },
      { class: 'radio-accent', desc: 'Adds `accent` to radio' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Radio</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="input" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered">
            <FormControl label="Neutral">
              <Radio name="opt" color="neutral" />
            </FormControl>

            <FormControl label="Primary">
              <Radio name="opt" color="primary" />
            </FormControl>

            <FormControl label="Secondary">
              <Radio name="opt" color="secondary" />
            </FormControl>

            <FormControl label="Accent">
              <Radio name="opt" color="accent" />
            </FormControl>

            <FormControl label="Disabled">
              <Radio name="opt" color="accent" value="" disabled />
            </FormControl>
          </div>
        </Wrapper>

        <Wrapper title="input + label position" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered">
            <div className="flex">
              <FormControl label="Neutral" labelPosition="right">
                <Radio name="opt" />
              </FormControl>
            </div>
            <div className="flex">
              <FormControl label="Primary" labelPosition="right">
                <Radio name="opt" color="primary" />
              </FormControl>
            </div>
            <div className="flex">
              <FormControl label="Secondary" labelPosition="right">
                <Radio name="opt" color="secondary" />
              </FormControl>
            </div>
          </div>
        </Wrapper>

        <Wrapper title="input + error" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-6 card bordered">
            <FormControl multiple formError={{ message: 'Must select one', type: 'required' }}>
              <div className="flex flex-col">
                <Label text="Option 1" labelPosition="right">
                  <Radio name="opt" color="error" />
                </Label>
                <Label text="Option 2" labelPosition="right">
                  <Radio name="opt" color="error" />
                </Label>
                <Label text="Option 3" labelPosition="right">
                  <Radio name="opt" color="error" />
                </Label>
              </div>
            </FormControl>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default RadioPage;
