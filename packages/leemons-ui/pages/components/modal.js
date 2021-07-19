import React from 'react';
import { Button, Modal, useModal, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function BadgePage() {
  const data = {
    showType: true,
    components: [
      { class: 'modal', desc: 'Container element' },
      { class: 'modal-box', desc: 'The content of modal' },
      { class: 'modal-action', desc: 'Container for modal buttons' },
      { class: 'modal-toggle', desc: 'For checkbox that controls modal' },
      { class: 'modal-button', desc: 'For <label> that checks the checkbox to opens/closes modal' },
    ],
    utilities: [{ class: 'compact', desc: 'Makes modal more compact' }],
  };

  const [myModal, toggleMyModal] = useModal();

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Modal</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="modal from button">
          <div className="rounded border border-base-200 bg-base-200 h-52 flex place-items-center place-content-center">
            <Button color="primary" onClick={() => toggleMyModal()}>
              Open Modal
            </Button>
            <Modal {...myModal}>Hola Mundo</Modal>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default BadgePage;
