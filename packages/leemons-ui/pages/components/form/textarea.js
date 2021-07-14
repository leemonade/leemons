import React from 'react';
import { FormControl, Textarea, Label } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Wrapper from '../../../src/components/Wrapper';

function TextareaPage() {
  const data = {
    showType: true,
    components: [
      { class: 'form-control', desc: 'Container element' },
      { class: 'label', desc: 'For helper text' },
      { class: 'textarea', desc: 'For <textarea> element' },
    ],
    utilities: [
      { class: 'textarea-bordered', desc: 'Adds border to textarea' },
      { class: 'textarea-ghost', desc: 'Adds ghost style to checkbox' },
      { class: 'textarea-primary', desc: 'Adds `primary` color to textarea' },
      { class: 'textarea-secondary', desc: 'Adds `secondary` color to textarea' },
      { class: 'textarea-accent', desc: 'Adds `accent` color to textarea' },
      { class: 'textarea-info', desc: 'Adds `info` color to textarea' },
      { class: 'textarea-success', desc: 'Adds `success` color to textarea' },
      { class: 'textarea-warning', desc: 'Adds `warning` color to textarea' },
      { class: 'textarea-error', desc: 'Adds `error` color to textarea' },
    ],
  };

  return (
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="Textarea with border" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <Label text="Your bio" />
          <Textarea className="h-24 textarea-bordered" placeholder="Bio" />
        </FormControl>
      </Wrapper>
      <Wrapper title="Textarea without border" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-10 card bg-base-200">
          <FormControl>
            <Label text="Your bio" />
            <Textarea className="h-24" placeholder="Bio" />
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="input ghost (no background)" className="flex flex-col space-y-2 max-w-xs">
        <div className="p-10 card bg-base-200">
          <FormControl>
            <Label text="Your bio" />
            <Textarea className="h-24 textarea-ghost" placeholder="Bio" />
          </FormControl>
        </div>
      </Wrapper>
      <Wrapper title="Textarea disabled" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <Label text="Disabled" />
          <Textarea
            className="h-24 textarea-bordered"
            placeholder="Disabled"
            disabled="disabled"
          ></Textarea>
        </FormControl>
      </Wrapper>
      <Wrapper title="Textarea with brand colors" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <Label text="primary" />
          <Textarea className="h-24 textarea-bordered textarea-primary" placeholder="Bio" />
        </FormControl>
        <FormControl>
          <Label text="secondary" />
          <Textarea className="h-24 textarea-bordered textarea-secondary" placeholder="Bio" />
        </FormControl>
        <FormControl>
          <Label text="accent" />
          <Textarea className="h-24 textarea-bordered textarea-accent" placeholder="Bio" />
        </FormControl>
      </Wrapper>
      <Wrapper title="Textarea with state colors" className="flex flex-col space-y-2 max-w-xs">
        <FormControl>
          <Label text="info" />
          <Textarea className="h-24 textarea-bordered textarea-info" placeholder="Bio" />
        </FormControl>
        <FormControl>
          <Label text="success" />
          <Textarea className="h-24 textarea-bordered textarea-success" placeholder="Bio" />
        </FormControl>
        <FormControl>
          <Label text="warning" />
          <Textarea className="h-24 textarea-bordered textarea-warning" placeholder="Bio" />
        </FormControl>
        <FormControl>
          <Label text="error" />
          <Textarea className="h-24 textarea-bordered textarea-error" placeholder="Bio" />
        </FormControl>
      </Wrapper>
    </div>
  );
}

export default TextareaPage;
