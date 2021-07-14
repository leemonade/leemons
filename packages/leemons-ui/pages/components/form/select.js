import React from 'react';
import { FormControl, Select, Label } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function SelectPage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'label', desc: 'For helper text' },
      { class: 'select', desc: 'For <select> element' },
    ],
    utilities: [
      { class: 'select-bordered', desc: 'Adds border to select' },
      { class: 'select-ghost', desc: 'Adds ghost style to checkbox' },
      { class: 'select-primary', desc: 'Adds `primary` color to select' },
      { class: 'select-secondary', desc: 'Adds `secondary` color to select' },
      { class: 'select-accent', desc: 'Adds `accent` color to select' },
      { class: 'select-info', desc: 'Adds `info` color to select' },
      { class: 'select-success', desc: 'Adds `success` color to select' },
      { class: 'select-warning', desc: 'Adds `warning` color to select' },
      { class: 'select-error', desc: 'Adds `error` color to select' },
      { class: 'select-lg', desc: 'Large size for select' },
      { class: 'select-md', desc: 'Medium (default) size for select' },
      { class: 'select-sm', desc: 'Small size for select' },
      { class: 'select-xs', desc: 'Extra small size for select' },
    ],
  };

  return (
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper className="flex flex-col space-y-2" title="select">
        <Select className="select-bordered w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select primary">
        <Select className="select-bordered select-primary w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select secondary">
        <Select className="select-bordered select-secondary w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select accent">
        <Select className="select-bordered select-accent w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select info">
        <Select className="select-bordered select-info w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select success">
        <Select className="select-bordered select-success w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select warning">
        <Select className="select-bordered select-warning w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select error">
        <Select className="select-bordered select-error w-full max-w-xs">
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select with labels">
        <FormControl className="w-full max-w-xs">
          <Label text="Choose your superpower">
            <a href="#" className="label-text-alt">
              Pick wisely
            </a>
          </Label>
          <Select className="select-bordered w-full">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
          <label className="label">
            <a href="#" className="label-text-alt">
              Cant pick?
            </a>
            <a href="#" className="label-text-alt">
              Need hint?
            </a>
          </label>
        </FormControl>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select sizes">
        <Select className="select-bordered select-lg w-full max-w-xs">
          <option disabled selected>
            Large
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Select className="select-bordered w-full max-w-xs">
          <option disabled selected>
            Normal
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Select className="select-bordered select-sm w-full max-w-xs">
          <option disabled selected>
            Small
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Select className="select-bordered select-xs w-full max-w-xs">
          <option disabled selected>
            Tiny
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>

      <Wrapper className="flex flex-col space-y-2" title="select diabled">
        <Select className="select-bordered w-full max-w-xs" disabled>
          <option disabled selected>
            Choose your superpower
          </option>
          <option>telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </Wrapper>
    </div>
  );
}

export default SelectPage;
