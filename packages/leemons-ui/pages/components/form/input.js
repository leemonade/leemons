import React from 'react';
import { FormControl, Input, Label } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function InputPage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'label', desc: 'For helper text' },
      { class: 'input', desc: 'For <input> element' },
    ],
    utilities: [
      { class: 'input-bordered', desc: 'Adds border to input' },
      { class: 'input-ghost', desc: 'Adds ghost style to checkbox' },
      { class: 'input-primary', desc: 'Adds `primary` color to input' },
      { class: 'input-secondary', desc: 'Adds `secondary` color to input' },
      { class: 'input-accent', desc: 'Adds `accent` color to input' },
      { class: 'input-info', desc: 'Adds `info` color to input' },
      { class: 'input-success', desc: 'Adds `success` color to input' },
      { class: 'input-warning', desc: 'Adds `warning` color to input' },
      { class: 'input-error', desc: 'Adds `error` color to input' },
      { class: 'input-lg', desc: 'Large size for input' },
      { class: 'input-md', desc: 'Medium (default) size for input' },
      { class: 'input-sm', desc: 'Small size for input' },
      { class: 'input-xs', desc: 'Extra small size for input' },
    ],
  };

  return (
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="input with border" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <Label text="Username" />
          <Input className="input input-bordered" type="text" placeholder="username" />
        </FormControl>
      </Wrapper>
      <Wrapper title="input without border" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-10 card bg-base-200">
          <FormControl>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <Input className="input" type="text" placeholder="username" />
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="input ghost (no background)" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-10 card bg-base-200">
          <FormControl>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <Input className="input input-ghost" type="text" placeholder="username" />
          </FormControl>
        </div>
      </Wrapper>

      <Wrapper title="input disabled" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">Disabled input</span>
          </label>
          <Input className="input input-bordered" type="text" placeholder="username" disabled />
        </FormControl>
      </Wrapper>

      <Wrapper title="input helper texts" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">Username</span>
            <a href="#" className="label-text-alt">
              Need help?
            </a>
          </label>
          <Input className="input input-bordered" type="text" placeholder="username" />
          <label className="label">
            <a href="#" className="label-text-alt">
              Forgot username?
            </a>
            <a href="#" className="label-text-alt">
              Are you sure?
            </a>
          </label>
        </FormControl>
      </Wrapper>
      <Wrapper title="input with brand colors" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">Primary</span>
          </label>
          <Input
            className="input input-primary input-bordered"
            type="text"
            placeholder="username"
          />
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Secondary</span>
          </label>
          <Input
            className="input input-secondary input-bordered"
            type="text"
            placeholder="username"
          />
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Accent</span>
          </label>
          <Input className="input input-accent input-bordered" type="text" placeholder="username" />
        </FormControl>
      </Wrapper>
      <Wrapper title="input with state colors" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <Input className="input input-info input-bordered" type="text" placeholder="username" />
          <label className="label">
            <span className="label-text-alt">Please enter data</span>
          </label>
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <Input
            className="input input-success input-bordered"
            type="text"
            placeholder="username"
          />
          <label className="label">
            <span className="label-text-alt">Data is valid</span>
          </label>
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <Input
            className="input input-warning input-bordered"
            type="text"
            placeholder="username"
          />
          <label className="label">
            <span className="label-text-alt">Data must be more than 3 characters</span>
          </label>
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <Input className="input input-error input-bordered" type="text" placeholder="username" />
          <label className="label">
            <span className="label-text-alt">Data is incorrect</span>
          </label>
        </FormControl>
      </Wrapper>
      <Wrapper title="input sizes" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">Large</span>
          </label>
          <Input className="input input-lg input-bordered" type="text" placeholder="username" />
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Normal</span>
          </label>
          <Input className="input input-bordered" type="text" placeholder="username" />
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Small</span>
          </label>
          <Input className="input input-sm input-bordered" type="text" placeholder="username" />
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">Tiny</span>
          </label>
          <Input className="input input-xs input-bordered" type="text" placeholder="username" />
        </FormControl>
      </Wrapper>
      <Wrapper title="with button" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <label className="label">
            <span className="label-text">connected</span>
          </label>
          <div className="relative">
            <Input
              className="w-full pr-16 input input-primary input-bordered"
              type="text"
              placeholder="Search"
            />
            <button className="absolute right-0 top-0 rounded-l-none btn btn-primary">go</button>
          </div>
        </FormControl>
        <FormControl>
          <label className="label">
            <span className="label-text">with space</span>
          </label>
          <div className="flex space-x-2">
            <Input
              className="w-full input input-primary input-bordered"
              type="text"
              placeholder="Search"
            />
            <button className="btn btn-primary">go</button>
          </div>
        </FormControl>
      </Wrapper>
    </div>
  );
}

export default InputPage;
