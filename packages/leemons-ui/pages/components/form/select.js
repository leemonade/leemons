import React from 'react';
import { Divider, FormControl, Label, Select } from '../../../src/components/ui';
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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Select</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper className="flex flex-col space-y-2" title="select">
          <Select outlined multiple={true} className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option value="TELECO">telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select primary">
          <Select outlined color="primary" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select secondary">
          <Select outlined color="secondary" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select accent">
          <Select outlined color="accent" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select info">
          <Select outlined color="info" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select success">
          <Select outlined color="success" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select warning">
          <Select outlined color="warning" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select error">
          <Select outlined color="error" className="w-full max-w-xs">
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select with labels">
          <FormControl label="Choose your superpower" className="w-full max-w-xs">
            <Select outlined className="w-full">
              <option disabled selected>
                Choose your superpower
              </option>
              <option>telekinesis</option>
              <option>time travel</option>
              <option>invisibility</option>
            </Select>
            <Label>
              <a href="#" className="label-text-alt">
                Cant pick?
              </a>
              <a href="#" className="label-text-alt">
                Need hint?
              </a>
            </Label>
          </FormControl>
        </Wrapper>

        <Wrapper title="select sizes">
          <div className="flex flex-col space-y-2">
            <Select outlined className="select-lg w-full max-w-xs">
              <option disabled selected>
                Large
              </option>
              <option>telekinesis</option>
              <option>time travel</option>
              <option>invisibility</option>
            </Select>
            <Select outlined className="w-full max-w-xs">
              <option disabled selected>
                Normal
              </option>
              <option>telekinesis</option>
              <option>time travel</option>
              <option>invisibility</option>
            </Select>
            <Select outlined className="select-sm w-full max-w-xs">
              <option disabled selected>
                Small
              </option>
              <option>telekinesis</option>
              <option>time travel</option>
              <option>invisibility</option>
            </Select>
            <Select outlined className="select-xs w-full max-w-xs">
              <option disabled selected>
                Tiny
              </option>
              <option>telekinesis</option>
              <option>time travel</option>
              <option>invisibility</option>
            </Select>
          </div>
        </Wrapper>

        <Wrapper className="flex flex-col space-y-2" title="select diabled">
          <Select outlined className="w-full max-w-xs" disabled>
            <option disabled selected>
              Choose your superpower
            </option>
            <option>telekinesis</option>
            <option>time travel</option>
            <option>invisibility</option>
          </Select>
        </Wrapper>
        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default SelectPage;
