/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */

// CSS modules
interface CSSModule {
  /**
   * Returns the specific selector from imported stylesheet as string.
   */
  [key: string]: string;
}

declare module '*.css' {
  const styles: CSSModule;
  export default styles;
}

declare module '*.module.css' {
  const styles: CSSModule;
  export default styles;
}

/* IMAGES */
declare module '*.svg' {
  const ref: string;
  export default ref;
}
declare module '*.bmp' {
  const ref: string;
  export default ref;
}
declare module '*.gif' {
  const ref: string;
  export default ref;
}
declare module '*.jpg' {
  const ref: string;
  export default ref;
}
declare module '*.jpeg' {
  const ref: string;
  export default ref;
}
declare module '*.png' {
  const ref: string;
  export default ref;
}
