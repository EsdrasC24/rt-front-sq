// Global types for testing environment

declare global {
  var IntersectionObserver: any;
  var ResizeObserver: any;
  var AbortController: any;
  var fetch: any;
  
  namespace NodeJS {
    interface Global {
      IntersectionObserver: any;
      ResizeObserver: any;
      AbortController: any;
      fetch: any;
    }
  }
}

export {};