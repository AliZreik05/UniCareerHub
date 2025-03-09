async function fetchWithToken(url, options = {}) 
{
    let response = await fetch(url, options);
    if (response.status === 401) {
        const data = await response.json();
        if (data.message === 'Access token expired') 
            {
            const refreshResponse = await fetch('/refresh');
            if (refreshResponse.ok) {
                response = await fetch(url, options);
            } else 
            {
                window.location.href = '/login';
            }
        }
    }
    return response;
}
async function loadProtectedData() 
{
    try 
    {
        const response = await fetchWithToken('/reviews/latest');
        if (response.ok) 
            {
            const data = await response.json();
            console.log('Protected data:', data);
        } 
        else 
        {
            console.error('Error fetching protected data');
        }
    } 
    catch (err) 
    {
        console.error('Fetch error:', err);
    }
}
document.addEventListener('DOMContentLoaded', loadProtectedData);
