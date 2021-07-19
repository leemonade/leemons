import React from 'react';
import { Avatar, AvatarGroup, Divider } from '../../src/components/ui';
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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Avatar</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="avatar">
          <div className="flex items-center space-x-8 flex-wrap mb-8">
            <Avatar rounded className="w-24 h-24">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
            </Avatar>
            <Avatar rounded className="w-14 h-14">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
            </Avatar>
            <Avatar rounded className="w-10 h-10">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </Wrapper>

        <Wrapper title="avatar-group">
          <div className="flex items-center space-x-8 flex-wrap">
            <AvatarGroup>
              <Avatar size={16}>
                <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
              </Avatar>
              <Avatar size={16}>
                <img src="http://daisyui.com/tailwind-css-component-profile-2@56w.png" />
              </Avatar>
              <Avatar size={16}>
                <img src="http://daisyui.com/tailwind-css-component-profile-3@56w.png" />
              </Avatar>
              <Avatar size={16}>
                <img src="http://daisyui.com/tailwind-css-component-profile-5@56w.png" />
              </Avatar>
            </AvatarGroup>
          </div>
        </Wrapper>

        <Wrapper title="avatar-group">
          <div className="flex items-center space-x-8 flex-wrap">
            <AvatarGroup gap={5} placeholder="+99" placeholderSize={10}>
              <Avatar size={10}>
                <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
              </Avatar>
              <Avatar size={10}>
                <img src="http://daisyui.com/tailwind-css-component-profile-2@40w.png" />
              </Avatar>
              <Avatar size={10}>
                <img src="http://daisyui.com/tailwind-css-component-profile-3@40w.png" />
              </Avatar>
              <Avatar size={10}>
                <img src="http://daisyui.com/tailwind-css-component-profile-5@40w.png" />
              </Avatar>
            </AvatarGroup>
          </div>
        </Wrapper>

        <Wrapper title="avatar circle">
          <div className="flex items-center space-x-8 flex-wrap mb-8">
            <Avatar circle size={24}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
            </Avatar>
            <Avatar circle size={14}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
            </Avatar>
            <Avatar circle size={10}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </Wrapper>

        <Wrapper title="avatar with border">
          <div className="flex items-center space-x-8 flex-wrap">
            <Avatar circle size={24} className="ring ring-neutral">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
            </Avatar>
            <Avatar circle size={14} className="ring ring-primary">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
            </Avatar>
            <Avatar circle size={10} className="ring ring-secondary">
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </Wrapper>

        <Wrapper title="avatar with presense indicator">
          <div className="flex items-center space-x-8 flex-wrap">
            <Avatar type="online" rounded size={24}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
            </Avatar>
            <Avatar type="offline" rounded size={14}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
            </Avatar>
            <Avatar type="online" rounded size={10}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </Wrapper>

        <Wrapper title="avatar with presense indicator">
          <div className="flex items-center space-x-8 flex-wrap">
            <Avatar type="online" circle size={24}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png" />
            </Avatar>
            <Avatar type="offline" circle size={14}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@56w.png" />
            </Avatar>
            <Avatar type="online" circle size={10}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </Wrapper>

        <Wrapper title="avatar placeholder">
          <div className="flex items-center space-x-8 flex-wrap">
            <Avatar
              type="placeholder"
              circle
              size={32}
              className="bg-neutral-focus text-neutral-content"
            >
              <span className="text-3xl">K</span>
            </Avatar>
            <Avatar
              type="online placeholder"
              circle
              size={24}
              className="bg-neutral-focus text-neutral-content"
            >
              <span className="text-xl">JO</span>
            </Avatar>
            <Avatar
              type="placeholder"
              circle
              size={16}
              className="bg-neutral-focus text-neutral-content"
            >
              <span>MX</span>
            </Avatar>
            <Avatar
              type="placeholder"
              circle
              size={10}
              className="bg-neutral-focus text-neutral-content"
            >
              <span>AA</span>
            </Avatar>
          </div>
        </Wrapper>
        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default AvatarPage;
