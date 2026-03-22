function getAuthHeaders() {
    return {
        'X-TenantID': localStorage.getItem('XTenantID'),
        'Authorization': 'Bearer ' + localStorage.getItem('Token')
    };
}
