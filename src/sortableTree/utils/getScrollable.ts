export const getScrollable = (element: HTMLElement): HTMLElement | null => {
    if (element.scrollHeight > element.clientHeight) {
      return element
    } else if (element.parentElement) {
      return getScrollable(element.parentElement)
    }

    return null
}