import React from 'react';
import { Avatar } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function AvatarPage() {
  const data = {
    showType: true,
    components: [
      { class: 'avatar', desc: 'Container element' },
      { class: 'avatar-group', desc: 'Container for grouping multiple avatars' },
    ],
    utilities: [
      { class: 'online', desc: 'shows a green dot as online indicator' },
      { class: 'offline', desc: 'shows a gray dot as online indicator' },
      { class: 'placeholder', desc: 'to show some letters as avatar placeholder' },
    ],
  };

  return (
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper title="avatar" className="flex items-center space-x-8 flex-wrap">
        <Avatar className="mb-8 rounded-btn w-24 h-24">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-btn w-14 h-14">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-btn w-10 h-10">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>

      <Wrapper title="avatar-group" className="flex items-center space-x-8 flex-wrap">
        <div className="avatar-group -space-x-6">
          <Avatar className="w-16 h-16">
            <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
          </Avatar>
          <Avatar className="w-16 h-16">
            <img src="http://daisyui.com/tailwind-css-component-profile-2@56w.png" />
          </Avatar>
          <Avatar className="w-16 h-16">
            <img src="http://daisyui.com/tailwind-css-component-profile-3@56w.png" />
          </Avatar>
          <Avatar className="w-16 h-16">
            <img src="http://daisyui.com/tailwind-css-component-profile-5@56w.png" />
          </Avatar>
        </div>
      </Wrapper>

      <Wrapper title="avatar-group" className="flex items-center space-x-8 flex-wrap">
        <div className="avatar-group -space-x-5">
          <Avatar className="w-10 h-10">
            <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
          </Avatar>
          <Avatar className="w-10 h-10">
            <img src="http://daisyui.com/tailwind-css-component-profile-2@40w.png" />
          </Avatar>
          <Avatar className="w-10 h-10">
            <img src="http://daisyui.com/tailwind-css-component-profile-3@40w.png" />
          </Avatar>
          <Avatar className="w-10 h-10">
            <img src="http://daisyui.com/tailwind-css-component-profile-5@40w.png" />
          </Avatar>
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10">
              <span>+99</span>
            </div>
          </div>
        </div>
      </Wrapper>

      <Wrapper title="avatar circle" className="flex items-center space-x-8 flex-wrap">
        <Avatar className="mb-8 rounded-full w-24 h-24">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-full w-14 h-14">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-full w-10 h-10">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>

      <Wrapper title="avatar with border" className="flex items-center space-x-8 flex-wrap">
        <Avatar className="mb-8 rounded-box w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-box w-14 h-14 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-box w-10 h-10 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>

      <Wrapper title="avatar circle" className="flex items-center space-x-8 flex-wrap">
        <Avatar className="mb-8 rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-full w-14 h-14 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar className="mb-8 rounded-full w-10 h-10 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>

      <Wrapper
        title="avatar with presense indicator"
        className="flex items-center space-x-8 flex-wrap"
      >
        <Avatar type="online" className="rounded-btn w-24 h-24">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar type="offline" className="rounded-btn w-14 h-14">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar type="online" className="rounded-btn w-10 h-10">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>
      <Wrapper
        title="avatar with presense indicator"
        className="flex items-center space-x-8 flex-wrap"
      >
        <Avatar type="online" className="rounded-full w-24 h-24">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
        </Avatar>
        <Avatar type="offline" className="rounded-full w-14 h-14">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
        </Avatar>
        <Avatar className="online rounded-full w-10 h-10">
          <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
        </Avatar>
      </Wrapper>
      <Wrapper title="avatar placeholder" className="flex items-center space-x-8 flex-wrap">
        <Avatar
          type="placeholder"
          className="bg-neutral-focus text-neutral-content rounded-full w-32 h-32"
        >
          <span className="text-3xl">K</span>
        </Avatar>
        <Avatar
          type="online placeholder"
          className="bg-neutral-focus text-neutral-content rounded-full w-24 h-24"
        >
          <span className="text-xl">JO</span>
        </Avatar>
        <Avatar
          type="placeholder"
          className="bg-neutral-focus text-neutral-content rounded-full w-16 h-16"
        >
          <span>MX</span>
        </Avatar>
        <Avatar
          type="placeholder"
          className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10"
        >
          <span>AA</span>
        </Avatar>
      </Wrapper>
    </div>
  );
}

export default AvatarPage;
