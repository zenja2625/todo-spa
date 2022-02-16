export const getCoordinates = (event: Event) => {
    if (event instanceof MouseEvent) {
        return { x: event.clientX, y: event.clientY }
    } else if (event instanceof TouchEvent) {
        if (event.touches.length > 0) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY }
        }
    }

    return { x: 0, y: 0 }
}
