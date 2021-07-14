import React from 'react';
import { FormControl, Checkbox, Label } from '../../../src/components/ui';
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
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="checkbox" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered shadow-lg">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Checkbox className="" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="checkbox primary" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered shadow-lg">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Checkbox className="checkbox-primary" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="checkbox secondary" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered shadow-lg">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Checkbox className="checkbox-secondary" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="checkbox accent" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered shadow-lg">
          <FormControl>
            <Label text="Remember me" className="cursor-pointer">
              <Checkbox className="checkbox-accent" />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="checkbox disabled" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-6 card bordered shadow-lg">
          <FormControl>
            <Label text="Disabled + unchecked">
              <Checkbox className="checkbox-accent" disabled />
            </Label>
          </FormControl>
          <FormControl>
            <Label text="Disabled + checked">
              <Checkbox className="checkbox-accent" checked disabled />
            </Label>
          </FormControl>
        </div>
      </Wrapper>
    </div>
  );
}

export default CheckboxPage;
