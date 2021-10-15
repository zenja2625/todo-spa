export const onUnload = (e: BeforeUnloadEvent) => {
    e.returnValue = 'Are you sure you want to leave?'
    
}