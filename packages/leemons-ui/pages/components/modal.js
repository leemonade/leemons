import React from 'react';
import Highlight from 'react-highlight';
import { Button, Modal, useModal, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function BadgePage() {
  const data = {
    showType: true,
    components: [
      { class: 'modal', desc: 'Container element' },
      { class: 'modal-body', desc: 'The content of modal' },
      { class: 'modal-action', desc: 'Container for modal buttons' },
    ],
  };

  const [deleteModal, toggleDeleteModal] = useModal({
    animated: true,
    title: 'Please confirm',
    buttons: [
      // eslint-disable-next-line react/jsx-key
      <Button color="ghost" className="text-black" onClick={() => toggleDeleteModal()}>
        Cancel
      </Button>,
      // eslint-disable-next-line react/jsx-key
      <Button color="error" onClick={() => toggleDeleteModal()}>
        Delete
      </Button>,
    ],
  });

  const [simpleModal, toggleSimpleModal] = useModal({
    animated: true,
    title: 'Information',
    message: 'Do you accept the information?',
    cancelLabel: 'Cancel',
    actionLabel: 'Accept',
    onAction: () => alert('Modal action is proccessed'),
  });

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Modal</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="modal from button" nocode>
          <div className="rounded border border-base-200 bg-base-200 h-52 flex flex-col space-y-2 place-items-center place-content-center">
            <Button color="primary" onClick={() => toggleDeleteModal()}>
              Open Custom Modal
            </Button>
            <Button color="primary" onClick={() => toggleSimpleModal()}>
              Open Simple Modal
            </Button>
            <Modal {...deleteModal}>
              <p>Do you really want to delete?</p>
            </Modal>
            <Modal {...simpleModal} />
          </div>
        </Wrapper>

        <Wrapper nocode>
          <p className="mb-4">How to use it:</p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <Highlight className="javascript p-4 bg-secondary text-xs">
                {`import { Modal, useModal } from "leemons-ui";

export default function MyComponent(props) {

  const [modal, toggleModal] = useModal({
    animated: true,
    title: 'Information',
    message: 'Do you accept the information?',
    cancelLabel: 'Cancel',
    actionLabel: 'Accept',
    onAction: () => alert('Modal action is triggered'),
  });

  return (
    <div>
      <button onClick={() => toggleModal()}>Open Simple Modal</button>
      <Modal {...modal} />
    </div>
  );
}`}
              </Highlight>
            </div>
          </div>
        </Wrapper>

        <Wrapper nocode>
          <p className="mb-4">Custom content and buttons:</p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <Highlight className="javascript p-4 bg-secondary text-xs">
                {`import { Modal, useModal } from "leemons-ui";

export default function MyComponent(props) {

  const [modal, toggleModal] = useModal({
    animated: true,
    title: 'Please confirm',
    buttons: [
      <Button color="ghost" className="text-black" onClick={() => toggleDeleteModal()}>
        Cancel
      </Button>,
      <Button color="error" onClick={() => toggleDeleteModal()}>
        Delete
      </Button>,
    ],

  return (
    <div>
      <button onClick={() => toggleModal()}>Open Simple Modal</button>
      <Modal {...modal}>
        <p>Do you really want to delete?</p>
      </Modal>
    </div>
  );
}`}
              </Highlight>
            </div>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default BadgePage;
