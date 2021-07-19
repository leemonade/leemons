import React from 'react';
import { XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Badge, Card, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function CardPage() {
  const data = {
    showType: true,
    components: [
      { class: 'card', desc: 'Container element' },
      { class: 'card-title', desc: 'Title of card' },
      { class: 'card-body', desc: 'Container for content' },
      { class: 'card-actions', desc: 'Container for buttons' },
    ],
    utilities: [
      { class: 'bordered', desc: 'Adds border`' },
      { class: 'compact', desc: 'Less padding' },
      { class: 'card-side', desc: 'The image in <figure> will be on to the side' },
      { class: 'image-full', desc: 'The image in <figure> element will be the background' },
    ],
  };

  return (
    <main>
      <div className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Card</span>
      </div>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="card" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bordered">
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="card-body">
              <div className="card-title">
                Top image
                <Badge color="secondary" className="mx-2">
                  NEW
                </Badge>
              </div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="justify-end card-actions">
                <Button color="secondary">More info</Button>
              </div>
            </div>
          </Card>

          <Card className="bordered">
            <div className="card-body">
              <div className="card-title">Image bottom</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="primary">Login</Button>
                <Button color="ghost">Register</Button>
              </div>
            </div>
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
          </Card>

          <Card className="bordered">
            <figure>
              <img className="w-full" src="https://picsum.photos/id/1005/60/40" />
            </figure>
            <div className="card-body">
              <div className="card-title">Small image file</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Badge color="ghost">Article</Badge>
                <Badge color="ghost">Photography</Badge>
              </div>
            </div>
          </Card>
        </Wrapper>

        <Wrapper
          title="card with shadow, image-full, small image size"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="text-center shadow-2xl">
            <figure className="px-10 pt-10">
              <img className="rounded-xl" src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="card-body">
              <div className="card-title">shadow, center, padding</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="justify-center card-actions">
                <Button color="accent">More info</Button>
              </div>
            </div>
          </Card>

          <Card className="shadow-xl image-full">
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="justify-end card-body">
              <div className="card-title">Image overlay</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="primary">Get Started</Button>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm bg-accent text-accent-content">
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="card-body">
              <div className="card-title">Accent color</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="secondary">More info</Button>
              </div>
            </div>
          </Card>
        </Wrapper>

        <Wrapper title="card with side image" className="grid grid-cols-1 gap-6">
          <Card className="lg:card-side bordered">
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="card-body">
              <div className="card-title">Horizontal</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="primary">Get Started</Button>
                <Button color="ghost">More info</Button>
              </div>
            </div>
          </Card>

          <Card className="lg:card-side bordered">
            <figure>
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div className="card-body">
              <div className="card-title">
                Horizontal<Badge className="mx-2">NEW</Badge>
              </div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="primary">Get Started</Button>
                <Button color="ghost">More info</Button>
              </div>
            </div>
          </Card>
        </Wrapper>

        <Wrapper title="card without image" className="grid grid-cols-1 gap-6">
          <Card className="lg:card-side bordered">
            <div className="card-body">
              <div className="card-title">No Images</div>
              <p>
                Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
                necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.
              </p>
              <div className="card-actions">
                <Button color="primary">Get Started</Button>
                <Button color="ghost">More info</Button>
              </div>
            </div>
          </Card>
        </Wrapper>

        <Wrapper title="card with out image" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow">
            <div className="card-body">
              <div className="card-title">no border with shadow</div>
              <p>Rerum reiciendis beatae tenetur excepturi</p>
            </div>
          </Card>

          <Card className="shadow-lg">
            <div className="card-body">
              <div className="card-title">no border with shadow</div>
              <p>Rerum reiciendis beatae tenetur excepturi</p>
            </div>
          </Card>
        </Wrapper>

        <Wrapper
          title="mini cards"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="shadow-2xl lg:card-side bg-primary text-primary-content">
            <div className="card-body">
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
              <div className="justify-end card-actions">
                <Button color="primary">
                  More info
                  <ChevronRightIcon className="inline-block w-6 h-6 ml-2 -mr-1 stroke-current" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="shadow-2xl lg:card-side bg-secondary text-secondary-content">
            <div className="card-body">
              <div className="justify-end card-actions">
                <Button square color="secondary">
                  <XIcon className="inline-block w-6 h-6 stroke-current" />
                </Button>
              </div>
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
            </div>
          </Card>

          <Card className="text-center shadow-2xl lg:card-side bg-accent text-accent-content">
            <div className="card-body">
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p>
              <div className="justify-center card-actions">
                <Button outlined color="secondary">
                  Start now
                </Button>
                <Button outlined color="secondary">
                  More info
                </Button>
              </div>
            </div>
          </Card>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default CardPage;
