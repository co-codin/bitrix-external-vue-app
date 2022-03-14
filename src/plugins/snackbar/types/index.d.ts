declare module 'vue/types/vue' {
  interface Vue {
    $snackbar (message: string, options?: object): void
  }
}
