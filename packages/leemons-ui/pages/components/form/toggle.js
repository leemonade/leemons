import React from 'react';
import { FormControl, Toggle, Label } from '../../../src/components/ui';
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
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="toggle" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Toggle className="" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="toggle primary" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Toggle className="toggle-primary" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="toggle secondary" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Toggle className="toggle-secondary" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="toggle accent" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Toggle className="toggle-accent" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="Disabled" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered">
          <FormControl>
            <Label text="Unchecked + Disabled">
              <Toggle className="toggle-accent" disabled />
            </Label>
          </FormControl>
          <FormControl>
            <Label text="Checked + Disabled">
              <Toggle className="toggle-accent" checked disabled />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
    </div>
  );
}

export default TogglePage;
