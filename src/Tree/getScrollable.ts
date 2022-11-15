export const getScrollable = (element: HTMLElement): HTMLElement | null => {
    const hasScrollableContent = element.scrollHeight > element.clientHeight

    const overflowYStyle = window.getComputedStyle(element).overflowY
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1

    if (hasScrollableContent && !isOverflowHidden) {
        return element
    } else if (element.parentElement) {
        return getScrollable(element.parentElement)
    }

    return null
}
