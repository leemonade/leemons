module.exports = function getAssets() {
  const assetDataExtraProps = {
    url: 'https://leemons.io',
    icon: 'https://uploads-ssl.webflow.com/63d7ab145d360ca1dd2d418f/63da71ec56119768e6afc9b8_Favicon.png',
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

  const mediaFileAsset = {
    name: 'Returned asset value for an audio',
    tagline: 'a returned asset value for an audio',
    description: 'a returned asset value for an audio description',
    color: '#993333',
    program: 'edabdea5-d16f-4681-8753-f6740caaf342',
    fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
    fromUserAgent: '17d5407b-d043-483f-a9fd-61eb9ffe3dae',
    indexable: 1,
    category: 'lrn:segment1:segment2:segment3:segment4:segment5:segment6',
    cover: {
      id: 'ed9bcda9-0d1d-48df-9f91-bf794cc02fbf',
      provider: 'leebrary-aws-s3',
      type: 'image/jpeg',
      extension: 'jpeg',
      name: 'Returned asset value for an audio',
      size: 45824,
      uri: 'leemons/leebrary/ed9bcda9-0d1d-48df-9f91-bf794cc02fbf.jpeg',
      isFolder: null,
      metadata: {
        size: '44.8 KB',
        format: 'JPEG',
        width: '1000',
        height: '666',
      },
      deleted: 0,
      created_at: '2023-09-01T14:33:05.000Z',
      updated_at: '2023-09-01T14:33:05.000Z',
      deleted_at: null,
    },
    id: 'dc6f671f-e967-4f14-bdfb-a04a6260f4fb@1.0.0',
    updated_at: '2023-09-01T14:33:05.000Z',
    created_at: '2023-09-01T14:33:05.000Z',
    public: null,
    center: null,
    deleted: 0,
    deleted_at: null,
    subjects: [
      {
        subject: 'db172925-237a-44a1-9dcf-4e4ceb7976cb',
        level: 'beginner',
      },
    ],
    file: {
      id: '5d249635-99e8-499c-9659-0d584cafd20f',
      provider: 'leebrary-aws-s3',
      type: 'audio/mpeg',
      extension: 'mpga',
      name: 'Returned asset value for an audio',
      size: 48136,
      uri: 'leemons/leebrary/5d249635-99e8-499c-9659-0d584cafd20f.mpga',
      isFolder: null,
      metadata: {
        size: '47.0 KB',
        format: 'MPEG Audio',
        duration: '0:01',
        bitrate: '320.0 kbps',
      },
      deleted: 0,
      created_at: '2023-09-01T14:33:03.000Z',
      updated_at: '2023-09-01T14:33:04.000Z',
      deleted_at: null,
    },
    tags: ['Leemons'],
  };

  const bookmarkAsset = {
    id: '88e36023-4a4a-48d9-b996-20e8b74e0d9c@1.0.0',
    name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
    tagline: 'Leemons website',
    description:
      'La única herramienta que da soporte a las metodologías de enseñanza más exitosas: Aprendizaje por proyectos, Role Playing, Cooperativo, Flipped Classroom, Design Thinking…',
    color: '#993333',
    cover: {
      id: '1e7e65bf-7213-434a-9052-754a0f8634e1',
      provider: 'leebrary-aws-s3',
      type: 'image/png',
      extension: 'png',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      size: 90101,
      uri: 'leemons/leebrary/1e7e65bf-7213-434a-9052-754a0f8634e1.png',
      isFolder: null,
      metadata: {
        size: '88.0 KB',
        format: 'PNG',
        width: '1024',
        height: '538',
      },
      deleted: 0,
      created_at: '2023-08-31T08:27:07.000Z',
      updated_at: '2023-08-31T08:27:07.000Z',
      deleted_at: null,
    },
    fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
    fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709',
    public: null,
    category: 'lrn:segment1:segment2:segment3:segment4:segment5:segment6',
    indexable: true,
    center: null,
    program: 'edabdea5-d16f-4681-8753-f6740caaf342',
    updated_at: '2023-08-29T10:44:12.000Z', //db property
    created_at: '2023-08-29T10:44:12.000Z', //db property
    deleted: 0, // db property
    deleted_at: null, // db property}
    subjects: [
      {
        subject: 'db172925-237a-44a1-9dcf-4e4ceb7976cb',
        level: 'beginner',
      },
    ],
    file: null,
    tags: ['Leemons'],
  };

  return {
    mediaFileAsset,
    bookmarkAsset,
    assetModel: {
      category: 'lrn:segment1:segment2:segment3:segment4:segment5:segment6',
      center: null,
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
      description: 'La única herramienta que da soporte a las metodologías de enseñanza más exitosas: Aprendizaje por proyectos, Role Playing, Cooperativo, Flipped Classroom, Design Thinking…',
      fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
      fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709',
      id: '88e36023-4a4a-48d9-b996-20e8b74e0d9c@1.0.0',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      indexable: true,
      program: null,
      public: null,
      tagline: 'Leemons website',
    },
    assetDBExtraProps: {
      updated_at: '2023-08-29T10:44:12.000Z', //db property
      created_at: '2023-08-29T10:44:12.000Z', //db property
      deleted: 0, // db property
      deleted_at: null, // db property}
    },
    assetDataExtraProps,
  };
};
