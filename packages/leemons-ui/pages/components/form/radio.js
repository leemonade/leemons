import React from 'react';
import { FormControl, Radio } from '../../../src/components/ui';
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
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="input" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <label className="cursor-pointer label">
              <span className="label-text">Neutral</span>
              <Radio name="opt" className="" />
            </label>
          </FormControl>

          <FormControl>
            <label className="cursor-pointer label">
              <span className="label-text">Primary</span>
              <Radio name="opt" className="radio-primary" />
            </label>
          </FormControl>

          <FormControl>
            <label className="cursor-pointer label">
              <span className="label-text">Secondary</span>
              <Radio name="opt" className="radio-secondary" />
            </label>
          </FormControl>

          <FormControl>
            <label className="cursor-pointer label">
              <span className="label-text">Accent</span>
              <Radio name="opt" className="radio-accent" />
            </label>
          </FormControl>

          <FormControl>
            <label className="label">
              <span className="label-text">Disabled</span>
              <Radio name="opt" className="radio-accent" value="" disabled />
            </label>
          </FormControl>
        </div>
      </Wrapper>
    </div>
  );
}

export default RadioPage;
