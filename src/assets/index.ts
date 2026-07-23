function importAll(r: any) {
  const icons: Record<string, string> = {};
  r.keys().forEach((key: string) => {
    const name = key.replace('./', '').replace('.svg', '');
    icons[name] = r(key);
  });
  return icons;
}

// @ts-ignore
const backgrounds = importAll(require.context('./icons/backgrounds', false, /\.svg$/));
// @ts-ignore
const book = importAll(require.context('./icons/book', false, /\.svg$/));
// @ts-ignore
const navigation = importAll(require.context('./icons/navigation', false, /\.svg$/));
// @ts-ignore
const user = importAll(require.context('./icons/user', false, /\.svg$/));

export const AllIcons = {
  ...backgrounds,
  ...book,
  ...navigation,
  ...user,
};

export default AllIcons;