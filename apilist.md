# Devtinder API's

## AUTH_ROUTER
POST /signup
POST /login
Post /logout

## PROFILE_ROUTER
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## CONNECTION_REQ_ROUTER
POST /request/send/intrested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## USER_ROUTER
GET /user/connections
GET /user/requests/received
GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, intrested, accepted, rejected
