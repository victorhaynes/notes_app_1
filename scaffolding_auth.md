# 1) Django provides out of the box helper methods for session-based auth
Note that even with session-based auth a CSRF token is required to be along with requests
for any state altering requests (i.e. POST, PUT, PATCH, DELETE)

This token is provided as a cookie with the response from the request that creates them (login()),
This token can be extracted and included as a X-CSRFToken header for state altering requests--such as logging out