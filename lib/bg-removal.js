"use client";

/* Turns a standard product photo (white/plain background) into a
 * transparent PNG so it layers cleanly on the Studio Canvas.
 *
 * NOT WIRED IN by default — this is reference code, not an active
 * dependency. I tried shipping this for real using @imgly/background-
 * removal (a genuine, free, client-side package), but it bundles the
 * ONNX Runtime Web engine, which needs webpack configured for
 * WebAssembly + worker files. Without that extra config it breaks the
 * production build outright — so rather than ship a broken deploy, I
 * pulled it back out.
 *
 * To turn this on for real:
 *   1. npm install @imgly/background-removal
 *   2. In next.config.mjs, add:
 *        webpack: (config) => {
 *          config.experiments = { ...config.experiments, asyncWebAssembly: true };
 *          return config;
 *        }
 *   3. Uncomment the import below.
 *   4. Re-run `npm run build` locally and confirm it completes before
 *      pushing — this is the exact step that broke last time, so
 *      verify it yourself before deploying.
 *
 * Until then, the simplest real path is: crop product photos to a
 * plain background yourself (or ask your affiliate network if they
 * provide pre-cut PNGs — some do) and drop them straight into
 * public/products like you're already doing.
 *
 * Usage once enabled:
 *   const transparentUrl = await removeBackground(file_or_image_url);
 *   // transparentUrl is an object URL you can drop straight into <img src>
 */
export async function removeBackground(input, onProgress) {
  // const { default: removeBg } = await import("@imgly/background-removal");
  // const blob = await removeBg(input, {
  //   progress: (key, current, total) => onProgress?.(current / total),
  // });
  // return URL.createObjectURL(blob);
  throw new Error("Background removal isn't wired in yet — see the comment at the top of lib/bg-removal.js for setup steps.");
}
