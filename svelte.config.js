import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: dev ? '' : '/shrine'
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Allow 404 errors for static assets in development
        if (path.startsWith('/images/') || path.startsWith('/icons/')) {
          console.warn(`[Warning] Missing static asset: ${path} (referenced from ${referrer})`);
          return;
        }
        // Otherwise, throw the error
        throw new Error(message);
      }
    }
  }
};

