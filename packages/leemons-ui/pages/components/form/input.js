import React from 'react';
import { Button, Divider, FormControl, Input, Label } from '../../../src/components/ui';
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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Input</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="input with border" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="Username">
            <Input outlined placeholder="username" type="date" />
          </FormControl>
        </Wrapper>
        <Wrapper title="input without border" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-10 card bg-base-200">
            <FormControl label="Username">
              <Input placeholder="username" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="input ghost (no background)" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-10 card bg-base-200">
            <FormControl label="Username">
              <Input color="ghost" placeholder="username" />
            </FormControl>
          </div>
        </Wrapper>

        <Wrapper title="input disabled" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="Disabled input">
            <Input outlined placeholder="username" disabled />
          </FormControl>
        </Wrapper>

        <Wrapper title="input helper texts" className="flex flex-col space-y-2 max-w-xs">
          <FormControl>
            <Label text="Username">
              <a href="#" className="label-text-alt">
                Need help?
              </a>
            </Label>
            <Input outlined placeholder="username" />
            <Label>
              <a href="#" className="label-text-alt">
                Forgot username?
              </a>
              <a href="#" className="label-text-alt">
                Are you sure?
              </a>
            </Label>
          </FormControl>
        </Wrapper>
        <Wrapper title="input with brand colors" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="Primary">
            <Input outlined color="primary" placeholder="username" />
          </FormControl>
          <FormControl label="Secondary">
            <Input outlined color="secondary" placeholder="username" />
          </FormControl>
          <FormControl label="Accent">
            <Input outlined color="accent" placeholder="username" />
          </FormControl>
        </Wrapper>
        <Wrapper title="input with state colors">
          <div className="flex flex-col space-y-2 max-w-xs">
            <FormControl label="Username">
              <Input outlined color="info" placeholder="username" />
              <Label text="Please enter data" helper />
            </FormControl>

            <FormControl label="Username">
              <Input outlined color="success" placeholder="username" />
              <Label text="Data is valid" helper />
            </FormControl>

            <FormControl label="Username">
              <Input outlined color="warning" placeholder="username" />
              <Label text="Data must be more than 3 characters" helper />
            </FormControl>

            <FormControl
              formError={{ message: 'Data is incorrect', type: 'required' }}
              label="Username"
            >
              <Input outlined color="error" placeholder="username" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="input sizes">
          <div className="flex flex-col space-y-2 max-w-xs">
            <FormControl label="Large">
              <Input outlined className="input-lg" placeholder="username" />
            </FormControl>
            <FormControl label="Normal">
              <Input outlined placeholder="username" />
            </FormControl>
            <FormControl label="Small">
              <Input outlined className="input-sm" placeholder="username" />
            </FormControl>
            <FormControl label="Tiny">
              <Input outlined className="input-xs" placeholder="username" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="with button" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="connected">
            <div className="relative">
              <Input outlined color="primary" className="w-full pr-16" placeholder="Search" />
              <Button
                color="primary"
                className="absolute right-0 top-0 rounded-l-none no-animation"
              >
                go
              </Button>
            </div>
          </FormControl>
          <FormControl label="with space">
            <div className="flex space-x-2">
              <Input outlined color="primary" className="w-full" placeholder="Search" />
              <Button color="primary">go</Button>
            </div>
          </FormControl>
        </Wrapper>

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default InputPage;
