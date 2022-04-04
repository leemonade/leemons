export default function getFakeImage(name) {
  switch (name) {
    case 'maleta.jpg':
      return 'https://images.unsplash.com/photo-1596603324167-4cbb7a0de677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80';
    case 'muro.png':
      return 'https://cdn.discordapp.com/attachments/868523669721337887/960551583161143386/MUROS_DOCUMENTAL_1.png';
    case 'tren.jpeg':
      return 'https://cdn.discordapp.com/attachments/868523669721337887/960550513269674044/TREN_MEMORIA_02.jpeg';
    default:
      return undefined;
  }
}
