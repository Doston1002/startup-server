## Startup Backend

#Demo

https://.....

#Overview

This project is a real startup. You can see admin, instructor and user professional dashboards APIs in the project. We have made 4 holidays in bizunit to have the project in international da rajada English, Uzbek, Turkish vaRus. To add payment methods, we used Stripe, one of the international companies. Students will be able to buy courses and also buy monthly VIP rates. Of course, instructors automatically send themselves to their cards within 24 hours of receiving their income. Of the profits, 70% for the instructor and 30% for the platform. Admin users, on the other hand, will be able to manage instructors.  On the platform admin users can place paid books and users have to buy them PDF files to email addresses.

#Stack

- NodeJS
- NestJS
- TypeScript
- Mongoose
- Decorators
- Sendgrid mail
- Validators
- Passport
- Stripe
- RxJS
- Jest Test
- Middlewaries
- Multer

## Student information management API security

The SIM login and data APIs require `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
`SECRET_JWT` (or `JWT_SECRET`) to be configured in the server environment.
There is no source-code fallback administrator password. Admin and director
login responses contain a signed access token; protected API requests must send
it as `Authorization: Bearer <token>`. Tokens expire after one hour.

Director passwords are bcrypt-hashed when created or changed. Existing
plaintext director passwords are upgraded to bcrypt after a successful login.
Student medical documents are stored outside the public static directory and
served only through the authenticated download endpoint.
Because director credentials were exposed, rotate all affected passwords and
the administrator password, and rotate `SECRET_JWT`/`JWT_SECRET` to invalidate
all existing tokens during deployment.
