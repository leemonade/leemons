module.exports = function getAssets() {
  const assetDataExtraProps = {
    url: 'https://leemons.io',
    icon: 'https://uploads-ssl.webflow.com/63d7ab145d360ca1dd2d418f/63da71ec56119768e6afc9b8_Favicon.png',
    subjects: null,
    tags: ['Leemons'],
    canAccess: [
      {
        id: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
        email: 'teacher@leemons.io',
        name: 'Willy',
        surnames: 'Rodríguez',
        secondSurname: null,
        birthdate: '1975-10-03T00:00:00.000Z',
        avatar: '/api/leebrary/img/5456aaf2-2637-4a5b-bd4d-edc7fe18cd14@1.0.0?t=1690442384793',
        gender: 'male',
        created_at: '2023-07-25T09:27:20.000Z',
        userAgentIds: ['a1c917f3-8771-4f92-8e2d-18657b3ec709'],
        permissions: ['owner'],
        editable: true,
      },
    ],
  };

  return {
    assetFull: {
      id: '88e36023-4a4a-48d9-b996-20e8b74e0d9c@1.0.0',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      tagline: 'Leemons website',
      description:
        'La única herramienta que da soporte a las metodologías de enseñanza más exitosas: Aprendizaje por proyectos, Role Playing, Cooperativo, Flipped Classroom, Design Thinking…',
      color: '#993333',
      cover: {
        id: '10debe3f-232d-41d5-9c42-9da4ebe0c937',
        provider: 'leebrary-aws-s3',
        type: 'image/png',
        extension: 'png',
        name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
        size: 90101,
        uri: 'leemons/leebrary/10debe3f-232d-41d5-9c42-9da4ebe0c937.png',
        isFolder: null,
        metadata: {
          size: '88.0 KB',
          format: 'PNG',
          width: '1024',
          height: '538',
        },
        deleted: 0,
        created_at: '2023-08-29T10:44:11.000Z',
        updated_at: '2023-08-29T10:44:12.000Z',
        deleted_at: null,
      },
      fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
      fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709',
      public: null,
      category: '0d144de4-023d-49f6-a959-5f163dd47cbd',
      indexable: true,
      center: null,
      program: null,
      updated_at: '2023-08-29T10:44:12.000Z', //db property
      created_at: '2023-08-29T10:44:12.000Z', //db property
      deleted: 0, // db property
      deleted_at: null, // db property}
    },
    assetModel: {
      id: '88e36023-4a4a-48d9-b996-20e8b74e0d9c@1.0.0',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      tagline: 'Leemons website',
      description:
        'La única herramienta que da soporte a las metodologías de enseñanza más exitosas: Aprendizaje por proyectos, Role Playing, Cooperativo, Flipped Classroom, Design Thinking…',
      color: '#993333',
      cover: {
        id: '10debe3f-232d-41d5-9c42-9da4ebe0c937',
        provider: 'leebrary-aws-s3',
        type: 'image/png',
        extension: 'png',
        name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
        size: 90101,
        uri: 'leemons/leebrary/10debe3f-232d-41d5-9c42-9da4ebe0c937.png',
        isFolder: null,
        metadata: {
          size: '88.0 KB',
          format: 'PNG',
          width: '1024',
          height: '538',
        },
        deleted: 0,
        created_at: '2023-08-29T10:44:11.000Z',
        updated_at: '2023-08-29T10:44:12.000Z',
        deleted_at: null,
      },
      fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
      fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709',
      public: null,
      category: '0d144de4-023d-49f6-a959-5f163dd47cbd',
      indexable: true,
      center: null,
      program: null,
    },
    assetDataExtraProps,
    assetDBExtraProps: {
      updated_at: '2023-08-29T10:44:12.000Z', //db property
      created_at: '2023-08-29T10:44:12.000Z', //db property
      deleted: 0, // db property
      deleted_at: null, // db property}
    },
  };
};
