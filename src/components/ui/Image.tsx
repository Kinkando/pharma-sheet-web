import Img from 'next/image';

export type ImageProps = React.ComponentProps<typeof Img>;

export function Image({ ...props }: ImageProps) {
  return <Img {...props} />;
}
