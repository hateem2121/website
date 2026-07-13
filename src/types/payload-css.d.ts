// Payload's Next integration ships a side-effect CSS entry point
// (`@payloadcms/next/css`) whose export resolves to a `.css` file with no
// bundled type declaration. The generated route/page files import it for
// styling; the bundler handles it fine, but `tsc` needs a declaration so the
// side-effect import type-checks. Declaring it as an untyped module satisfies
// the type checker without affecting the build output.
declare module '@payloadcms/next/css'
