export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if(isNaN(date.getTime())) {
        return 'Format de date est non valide'
    }
    return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12: true
    })
}