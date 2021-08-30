import React from 'react';
import { FormControl, Textarea, Divider } from '../../../src/components/ui';
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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span>Form </span>
        <span className="text-primary">Textarea</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="Textarea with border" className="flex flex-col space-y-2 max-w-xs">
          <FormControl
            label="Your bio"
            formError={{ message: 'Campo requerido', type: 'required' }}
          >
            <Textarea
              className="h-24 textarea-bordered"
              placeholder="Bio"
              maxLength={140}
              showCount
            />
          </FormControl>
        </Wrapper>
        <Wrapper title="Textarea without border" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-10 card bg-base-200">
            <FormControl label="Your bio">
              <Textarea className="h-24" placeholder="Bio" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="input ghost (no background)" className="flex flex-col space-y-2 max-w-xs">
          <div className="p-10 card bg-base-200">
            <FormControl label="Your bio">
              <Textarea className="h-24 textarea-ghost" placeholder="Bio" />
            </FormControl>
          </div>
        </Wrapper>
        <Wrapper title="Textarea disabled" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="Disabled">
            <Textarea
              className="h-24 textarea-bordered"
              placeholder="Disabled"
              disabled="disabled"
            ></Textarea>
          </FormControl>
        </Wrapper>
        <Wrapper title="Textarea with brand colors" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="primary">
            <Textarea outlined color="primary" className="h-24" placeholder="Bio" />
          </FormControl>
          <FormControl label="secondary">
            <Textarea outlined color="secondary" className="h-24" placeholder="Bio" />
          </FormControl>
          <FormControl label="accent">
            <Textarea outlined color="accent" className="h-24" placeholder="Bio" />
          </FormControl>
        </Wrapper>
        <Wrapper title="Textarea with state colors" className="flex flex-col space-y-2 max-w-xs">
          <FormControl label="info">
            <Textarea outlined color="info" className="h-24" placeholder="Bio" />
          </FormControl>
          <FormControl label="success">
            <Textarea outlined color="success" className="h-24" placeholder="Bio" />
          </FormControl>
          <FormControl label="warning">
            <Textarea outlined color="warning" className="h-24" placeholder="Bio" />
          </FormControl>
          <FormControl label="error">
            <Textarea outlined color="error" className="h-24" placeholder="Bio" />
          </FormControl>
        </Wrapper>
        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TextareaPage;
