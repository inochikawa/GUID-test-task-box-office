# GUID-test-task-box-office
Setup:
- Go to `appsettings.json` in `BO.Web` project and set your DB connection string.
- Go to `BO.Web` project in terminal and run `dotnet run`. Project will be hosted on http://localhost:5000
- Every time you run the project -> there will be recreated DB with initial data.
- Default admin credentials:
```
Username: admin
Password: admin
```

---
What used:
- On client side: ReactJS, MobX, React-router, Aurelia.
- On server side: AspNet Core 3, Entity Framework, MS SQL.

---
What was not implemented:
- Creating and Editing shows on UI. On the backend API is already exists for this
- Displating ordered Tickets

---
What needs to be improved:
- Do not store user's password in the DB. Instead should be stored only hash of password.
- Use tool to automatically map DTO to Entity and vice-verca
- Complete API to manage users (edit user, delete)
- Filtering shows by Dates. Currently it is not completelly correct because of TimeZones
- Implent "right" Roting manager instead of using default React-router. So I can use url's params on any page. And it will make code more clean.
- Store user's token in the cookies. So a user don't need to login every time after page reloading.
- Implement services/managers to manage shows, tickets. Because currently all is done directly in controllers.
- Add proper notifications on UI. So a user knows what is going on after api request. I mean display any validation errors, display errors from server.
