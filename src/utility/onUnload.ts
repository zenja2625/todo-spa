export const onUnload = (e: BeforeUnloadEvent) => {
    e.returnValue = 'Дождитесь сохранение информации'
}