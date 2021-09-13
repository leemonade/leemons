import Link from 'next/link';

export default function Index() {
  const pages = [
    'tree-edition-03.01.01.02',
    'tree-edition-03.01.03.02G',
    'tree-edition-traslation-03.01.03.02B',
  ];
  return (
    <>
      <ul>
        {pages.map((page) => (
          <li key={page}>
            <a>
              <Link href={`./wip-dev/${page}`}>{page}</Link>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
