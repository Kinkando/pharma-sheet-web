import { env } from 'next-runtime-env';

export interface Config {
  readonly apiHost: string;
  readonly apiKey: string;
}

const config: Config = {
  apiHost: env('NEXT_PUBLIC_API_HOST')!,
  apiKey: env('NEXT_PUBLIC_API_KEY')!,
};

export default config;
