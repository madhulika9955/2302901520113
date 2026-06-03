Stage 1 

<img width="1252" height="935" alt="1" src="https://github.com/user-attachments/assets/40a00661-b982-45e9-ac57-674fb53651f9" />
so this image shows that middlewares are logged succesfully

A direct HTTP GET request using the native fetch API to:
http://4.224.186.213/evaluation-service/notifications
It sends an Authorization: Bearer <TOKEN> header.
It parses the JSON response and returns the notifications array.
If the API request fails or returns a non-OK response, it falls back to a local SAMPLE_NOTIFICATIONS array instead of crashing.


<img width="1247" height="968" alt="2" src="https://github.com/user-attachments/assets/ca0f4e04-e25a-4501-bfbe-645d3f2e7fc4" />
<img width="1086" height="738" alt="3" src="https://github.com/user-attachments/assets/edd6df2d-0a18-4749-9289-630e2f1d11ff" />
this image shows that all the notifications are been showed


stage 2
<img width="1232" height="856" alt="4" src="https://github.com/user-attachments/assets/2bb58e32-b3d8-4fc9-bc54-528eadbcc729" />
<img width="1237" height="863" alt="5" src="https://github.com/user-attachments/assets/3cf31127-56f7-424f-b935-5801174e11d0" />
this shows the final react ui


